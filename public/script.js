var vm = new Vue({
  el: '#app',
  data: {
    total: 0,
    results: [],
    items: [
      {id: 1, price: 9.99, title: 'Html 5'},
      {id: 2, price: 10.99, title: 'Css 3'},
      {id: 3, price: 11.99, title: 'Java Script'},
    ],
    cart: [],
    oldSearch: "",
    newSearch: "anime",
    loading: false,
  },
  methods: {
    appendItems: function () {
      if (this.items.length === this.results.length) {
        return;
      }
      this.items = this.results.slice(0, this.items.length + 10);
    },
    submitForm: function () {
      this.loading = true;
      this.$http
        .get("/search/".concat(this.newSearch))
        .then((response) => {
          this.results = [];
          response.data.forEach(item => {
            this.results.push({
              id: item.id,
              title: item.title,
              price: 9.99,
              image: item.link
            });
          });
          this.items = this.results.slice(0, 10);
          this.loading = false;
          this.oldSearch = this.newSearch;
        });
    },
    getItem: function (id) {
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === id) {
          return this.cart[i];
        }
      }
      return null;
    },
    removeItem: function (id) {
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === id) {
          this.cart.splice(i, 1);
          break;
        }
      }
    },
    addItem: function (index) {
      var item = this.items[index];
      this.total += item.price;

      var existItem = this.getItem(item.id);
      if (existItem !== null) {
        existItem.qty++;
      } else {
        this.cart.push({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: 1,
        });
      }

    },
    inc: function (item) {
      item.qty++;
      this.total += item.price;
    },
    dec: function (item) {
      item.qty--;
      this.total -= item.price;
      if (item.qty === 0) {
        this.removeItem(item.id);
      }
    }
  },
  filters: {
    currency: function (price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function () {
    this.submitForm();

    var el = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(el);
    watcher.enterViewport(() => {
      this.appendItems();
    });
  },
  computed: {
    noMoreItems: function () {
      return this.results.length > 0 && this.results.length === this.items.length;
    }
  }
});
