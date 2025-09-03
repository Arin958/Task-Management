// controllers/dashboardController.js
const Task = require("../models/Task");
const User = require("../models/User");
const Company = require("../models/Company");

// Get dashboard data for boss (admin/manager)
exports.getBossDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // For superadmin, get all companies data
    if (user.role === "superadmin") {
      const companies = await Company.find({ isActive: true });
      const users = await User.find({ isActive: true });
      const tasks = await Task.find().populate("assignees", "name");
      
      // Calculate statistics
      const stats = {
        totalCompanies: companies.length,
        totalEmployees: users.filter(u => u.role === "employee").length,
        totalManagers: users.filter(u => u.role === "manager").length,
        totalAdmins: users.filter(u => u.role === "admin").length,
        totalTasks: tasks.length,
        todoTasks: tasks.filter(t => t.status === "todo").length,
        inProgressTasks: tasks.filter(t => t.status === "in-progress").length,
        reviewTasks: tasks.filter(t => t.status === "review").length,
        completedTasks: tasks.filter(t => t.status === "completed").length,
      };
      
      return res.json({
        user: {
          name: user.name,
          role: user.role,
          companyId: user.companyId
        },
        stats,
        recentTasks: tasks.slice(0, 10).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        companies
      });
    }
    
    // For admin/manager, get company-specific data
    const companyId = user.companyId;
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Get all users in the same company
    const companyUsers = await User.find({ 
      companyId, 
      isActive: true,
      role: { $in: ["employee", "manager"] } // Exclude other admins from this view
    });
    
    // Get only COMPANY tasks for the company (exclude personal tasks)
    const companyTasks = await Task.find({ 
      companyId,
      visibility: "company" // Only include company visibility tasks
    })
    .populate("assignees", "name")
    .populate("createdBy", "name");
    
    // Calculate statistics
    const stats = {
      totalEmployees: companyUsers.filter(u => u.role === "employee").length,
      totalManagers: companyUsers.filter(u => u.role === "manager").length,
      totalTasks: companyTasks.length,
      todoTasks: companyTasks.filter(t => t.status === "todo").length,
      inProgressTasks: companyTasks.filter(t => t.status === "in-progress").length,
      reviewTasks: companyTasks.filter(t => t.status === "review").length,
      completedTasks: companyTasks.filter(t => t.status === "completed").length,
      highPriorityTasks: companyTasks.filter(t => t.priority === "high" || t.priority === "critical").length,
    };
    
    // Get overdue tasks (only company tasks)
    const overdueTasks = companyTasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== "completed";
    });
    
    res.json({
      user: {
        name: user.name,
        role: user.role,
        companyId: user.companyId
      },
      company,
      stats,
      recentTasks: companyTasks.slice(0, 10).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      overdueTasks: overdueTasks.slice(0, 5),
      teamMembers: companyUsers
    });
    
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get dashboard data for employee
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const companyId = user.companyId;
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    
    // Get tasks assigned to this employee
    const assignedTasks = await Task.find({ 
      companyId, 
      assignees: userId 
    })
    .populate("assignees", "name")
    .populate("createdBy", "name");
    
    // Calculate statistics for employee's tasks
    const stats = {
      totalTasks: assignedTasks.length,
      todoTasks: assignedTasks.filter(t => t.status === "todo").length,
      inProgressTasks: assignedTasks.filter(t => t.status === "in-progress").length,
      reviewTasks: assignedTasks.filter(t => t.status === "review").length,
      completedTasks: assignedTasks.filter(t => t.status === "completed").length,
      highPriorityTasks: assignedTasks.filter(t => t.priority === "high" || t.priority === "critical").length,
    };
    
    // Get overdue tasks
    const overdueTasks = assignedTasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== "completed";
    });
    
    // Get recent completed tasks
    const recentCompleted = assignedTasks
      .filter(t => t.status === "completed")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
    
    res.json({
      user: {
        name: user.name,
        role: user.role,
        companyId: user.companyId
      },
      company,
      stats,
      assignedTasks: assignedTasks.slice(0, 10).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      overdueTasks: overdueTasks.slice(0, 5),
      recentCompleted
    });
    
  } catch (error) {
    console.error("Employee dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};