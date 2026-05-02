// pages/me/me.js
const app = getApp();

Page({
  data: {
    stats: {
      total: 0,
      categories: 0,
      recently: 0
    },
    categories: [],
    recentRecipes: []
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    const recipes = app.getAllRecipes();
    const categories = app.getCategories();

    // 统计最近7天添加的
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recently = recipes.filter(r => new Date(r.createdAt) > weekAgo).length;

    // 最近添加的5个
    const recentRecipes = recipes.slice(0, 5);

    this.setData({
      stats: {
        total: recipes.length,
        categories: categories.length,
        recently
      },
      categories,
      recentRecipes
    });
  },

  // 添加分类
  addCategory() {
    wx.showModal({
      title: '添加分类',
      prompt: '请输入分类名称',
      editable: true,
      placeholderText: '例如：川菜',
      success: (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          const categories = app.getCategories();
          if (!categories.includes(res.content.trim())) {
            categories.push(res.content.trim());
            wx.setStorageSync('categories', categories);
            this.loadStats();
            wx.showToast({ title: '添加成功', icon: 'success' });
          } else {
            wx.showToast({ title: '分类已存在', icon: 'none' });
          }
        }
      }
    });
  },

  // 删除分类
  deleteCategory(e) {
    const index = e.currentTarget.dataset.index;
    const categories = app.getCategories();

    wx.showModal({
      title: '删除分类',
      content: `确定要删除「${categories[index]}」吗？`,
      success: (res) => {
        if (res.confirm) {
          categories.splice(index, 1);
          wx.setStorageSync('categories', categories);
          this.loadStats();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // 清空所有数据
  clearAllData() {
    wx.showModal({
      title: '清空数据',
      content: '确定要清空所有菜谱吗？此操作不可恢复！',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '再次确认',
            content: '这是最后一次确认，请谨慎操作',
            success: (confirm) => {
              if (confirm.confirm) {
                wx.setStorageSync('recipes', []);
                this.loadStats();
                wx.showToast({ title: '已清空', icon: 'success' });
              }
            }
          });
        }
      }
    });
  }
})
