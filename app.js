// 肉肉食谱 - 全局入口
App({
  globalData: {
    userInfo: null,
    token: null
  },

  onLaunch() {
    // 初始化本地存储数据
    this.initStorage();
  },

  // 初始化本地存储
  initStorage() {
    const recipes = wx.getStorageSync('recipes');
    if (!recipes) {
      wx.setStorageSync('recipes', []);
    }

    const categories = wx.getStorageSync('categories');
    if (!categories) {
      wx.setStorageSync('categories', ['家常菜', '快手菜', '硬菜', '甜点', '饮品']);
    }
  },

  // 获取所有菜谱
  getAllRecipes() {
    return wx.getStorageSync('recipes') || [];
  },

  // 保存菜谱
  saveRecipes(recipes) {
    wx.setStorageSync('recipes', recipes);
  },

  // 获取分类
  getCategories() {
    return wx.getStorageSync('categories') || ['家常菜', '快手菜', '硬菜', '甜点', '饮品'];
  }
})
