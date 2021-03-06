FinanceClone.Views.Navbar = Backbone.View.extend({

  template: JST['navbar'],

  //will later need a listenTo for the recent quotes collection and notification messages collection

  events: {
    "submit .quote-form": "getQuote",
    "click .sign-out": "signOut"
  },

  initialize: function () {
    this.listenTo(this.collection, "sync", this.render);
    this.listenTo(FinanceClone.Collections.companies, "sync", this.render);
    this.listenTo(FinanceClone.Collections.notification_messages, "sync", this.render);
  },

  render: function () {
    var renderedContent = this.template({
      recent_quotes: this.collection
    });
    this.$el.html(renderedContent);
    return this;
  },

  getQuote: function (event) {
    event.preventDefault();
    that = this;
    var params = $(event.currentTarget).serializeJSON();
    var newRecentQuote = new FinanceClone.Models.RecentQuote(params["recent_quote"]);

    newRecentQuote.save({}, {
      success: function () {
        
        var attrs = {
          user_id: Number(window.currentUser.id), 
          company_id: Number(newRecentQuote.escape("company_id"))
        };

        FinanceClone.Collections.recent_quotes.fetch();
        FinanceClone.Collections.recent_quotes.add(newRecentQuote);

        var old_quote = FinanceClone.Collections.recent_quotes.where(attrs);
        old_quote = old_quote[0];
        old_quote.destroy();


        var path = "#companies/" + newRecentQuote.escape("company_id") + "";
        Backbone.history.navigate(path, { trigger: true });
      }
    });
  },

  signOut: function (event) {
    $.ajax({
      url: "/session",
      type: "delete",
      success: function(){}
    });
  }

});