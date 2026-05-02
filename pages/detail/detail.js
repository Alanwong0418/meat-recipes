// pages/detail/detail.js
const app = getApp();

Page({
  data: {
    recipe: null,
    copied: false
  },

  onLoad(options) {
    const { id } = options;
    this.loadRecipe(id);
  },

  loadRecipe(id) {
    const recipes = app.getAllRecipes();
    const recipe = recipes.find(r => r.id === parseInt(id));

    if (recipe) {
      // 增加浏览次数
      recipe.cookCount = (recipe.cookCount || 0) + 1;
      app.saveRecipes(recipes);
    }

    this.setData({ recipe });
  },

  // 复制配料
  copyIngredients() {
    const { recipe } = this.data;
    if (!recipe) return;

    const text = recipe.ingredients.join('\n');
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '配料已复制', icon: 'success' });
        this.setData({ copied: true });
        setTimeout(() => this.setData({ copied: false }), 2000);
      }
    });
  },

  // 复制做法
  copySteps() {
    const { recipe } = this.data;
    if (!recipe || !recipe.steps || recipe.steps.length === 0) {
      wx.showToast({ title: '暂无做法步骤', icon: 'none' });
      return;
    }

    const text = recipe.steps.join('\n');
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '做法已复制', icon: 'success' });
      }
    });
  },

  // 删除菜谱
  deleteRecipe() {
    wx.showModal({
      title: '确认删除',
      content: `确定要删除「${this.data.recipe.name}」吗？`,
      success: (res) => {
        if (res.confirm) {
          const recipes = app.getAllRecipes().filter(r => r.id !== this.data.recipe.id);
          app.saveRecipes(recipes);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        }
      }
    });
  },

  // 分享
  onShareAppMessage() {
    const { recipe } = this.data;
    return {
      title: `教你做${recipe.name}`,
      path: `/pages/detail/detail?id=${recipe.id}`
    };
  }
})
