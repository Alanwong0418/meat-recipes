// pages/home/home.js
const app = getApp();

Page({
  data: {
    recipes: [],
    categories: [],
    selectedCategory: '全部',
    showAddModal: false,
    todayRecommend: null,
    searchKeyword: ''
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  // 加载数据
  loadData() {
    const recipes = app.getAllRecipes();
    const categories = app.getCategories();
    const allCategories = ['全部', ...categories];

    this.setData({
      recipes,
      categories: allCategories
    });

    // 设置今日推荐
    if (recipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      this.setData({
        todayRecommend: recipes[randomIndex]
      });
    }
  },

  // 筛选分类
  selectCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ selectedCategory: category });
  },

  // 获取筛选后的菜谱
  getFilteredRecipes() {
    const { recipes, selectedCategory, searchKeyword } = this.data;
    let filtered = recipes;

    if (selectedCategory !== '全部') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    if (searchKeyword) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.ingredients.some(i => i.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    }

    return filtered;
  },

  // 搜索
  onSearch(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  // 跳转到详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  // 今日推荐
  recommendToday() {
    const { recipes } = this.data;
    if (recipes.length === 0) {
      wx.showToast({ title: '还没有菜谱哦~', icon: 'none' });
      return;
    }

    const randomIndex = Math.floor(Math.random() * recipes.length);
    this.setData({ todayRecommend: recipes[randomIndex] });
  },

  // 打开添加弹窗
  openAddModal() {
    this.setData({ showAddModal: true });
  },

  // 关闭添加弹窗
  closeAddModal() {
    this.setData({ showAddModal: false });
  },

  // 添加新菜谱
  addRecipe(e) {
    const { name, category, ingredients, steps, image } = e.detail.value;

    if (!name || !name.trim()) {
      wx.showToast({ title: '请输入菜名', icon: 'none' });
      return;
    }

    if (!ingredients || !ingredients.trim()) {
      wx.showToast({ title: '请输入配料', icon: 'none' });
      return;
    }

    // 解析配料（按换行分割）
    const ingredientList = ingredients.split('\n').filter(i => i.trim());

    // 解析步骤（按换行分割）
    const stepList = steps ? steps.split('\n').filter(s => s.trim()) : [];

    const newRecipe = {
      id: Date.now(),
      name: name.trim(),
      category: category || '家常菜',
      ingredients: ingredientList,
      steps: stepList,
      image: image || '',
      createdAt: new Date().toISOString(),
      cookCount: 0
    };

    const recipes = app.getAllRecipes();
    recipes.unshift(newRecipe);
    app.saveRecipes(recipes);

    this.setData({ showAddModal: false });
    wx.showToast({ title: '添加成功~', icon: 'success' });
    this.loadData();
  },

  // 删除菜谱
  deleteRecipe(e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个菜谱吗？',
      success: (res) => {
        if (res.confirm) {
          const recipes = app.getAllRecipes().filter(r => r.id !== id);
          app.saveRecipes(recipes);
          this.loadData();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // 跳转到今日推荐详情
  goToRecommend() {
    if (this.data.todayRecommend) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${this.data.todayRecommend.id}`
      });
    }
  }
})
