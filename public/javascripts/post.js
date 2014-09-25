var Post = Backbone.Model.extend({});

var PostCollection = Backbone.Collection.extend({
    model: Post,
    url: "/posts"
});

var PostListView = Backbone.View.extend({
    tagName: 'div',
    id: 'posts',
    initialize: function() {
        this.collection.bind("all", this.render, this)
    },
    template: Handlebars.compile($("#postList-tpl").html()),
    events: {
        'click .newPost'        : 'add',
        'click .detail'         : 'detail',
        'click .edit'           : 'edit',
        'click .remove'         : 'delete',
        'mouseover .inactive'   : 'show',
        'click .active'         : 'hide'
    },
    add: function(e) {
        e.preventDefault();
        postRouter.navigate("posts/new", true);
    },
    detail: function(e) {
        e.preventDefault();
        var model = $(e.currentTarget).data('id');
        postRouter.navigate("posts/" + model, true);
        return false;
    },
    edit: function(e) {
        e.preventDefault();
        var model = $(e.currentTarget).data('id');
        postRouter.navigate("posts/edit/" + model, true);
    },
    delete: function(e) {
        e.preventDefault();
        var model = this.collection.get($(e.currentTarget).data('id'));
        model.destroy();    
    },
    show: function() {
        $(".hidden").addClass("show").removeClass("hidden");
        $(".inactive").addClass("active").removeClass("inactive");
        $(".plus").addClass("cross").removeClass("plus");
    },
    hide: function() {
        $(".show").addClass("hidden").removeClass("show");
        $(".active").addClass("inactive").removeClass("active");
        $(".cross").addClass("plus").removeClass("cross");
    },
    render: function() {
        html = this.template({
        items: this.collection.toJSON()
        });
        this.$el.html(html);
        return this;
    }
});

var PostDetailView = Backbone.View.extend({
    template: Handlebars.compile($("#postDetail-tpl").html()),
    events: {
        'click .edit'           : 'edit',
        'click .remove'         : 'delete',
        'click .back'           : 'back',
        'mouseover .inactive'   : 'show',
        'click .active'         : 'hide'
    },
    edit: function(e) {
        e.preventDefault();
        var model = $(e.currentTarget).data('id');
        postRouter.navigate("posts/edit/" + model, true);
    },
    delete: function(e) {
        e.preventDefault();
        this.model.destroy({
            dataType : 'text',
            success: function() {
                postRouter.navigate("",true);
            }
        });
    },
    back: function(e) {
        e.preventDefault();
        postRouter.navigate("", true);
    },
    show: function() {
        $(".hidden").addClass("show").removeClass("hidden");
        $(".inactive").addClass("active").removeClass("inactive");
        $(".plus").addClass("cross").removeClass("plus");
    },
    hide: function() {
        $(".show").addClass("hidden").removeClass("show");
        $(".active").addClass("inactive").removeClass("active");
        $(".cross").addClass("plus").removeClass("cross");
    },
    render: function() {
        html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    }
});

var NewPostView = Backbone.View.extend({
    template: Handlebars.compile(($("#postForm-tpl").html())),
    events: {
        'submit form'           : 'addPost',
        'click .back'           : 'back',
        'mouseover .inactive'   : 'show',
        'click .active'         : 'hide'
    },
    addPost: function(e) {
        e.preventDefault();
        this.collection.create({
            title: $('#titleInput').val(),
            content: $('#contentInput').val(),
        },{
            success: function() {
                postRouter.navigate("", true);
            }
        });
    },
    back: function(e) {
        e.preventDefault();
        postRouter.navigate("", true);
    },
    show: function() {
        $(".hidden").addClass("show").removeClass("hidden");
        $(".inactive").addClass("active").removeClass("inactive");
        $(".plus").addClass("cross").removeClass("plus");
    },
    hide: function() {
        $(".show").addClass("hidden").removeClass("show");
        $(".active").addClass("inactive").removeClass("active");
        $(".cross").addClass("plus").removeClass("cross");
    },
    render: function() {
        html = this.template();
        this.$el.html(html);
        return this;
    }
});

var EditPostView = Backbone.View.extend({
    template: Handlebars.compile(($("#postForm-tpl").html())),
    events: {
        'submit form'           : 'updatePost',
        'click .back'           : 'back',
        'mouseover .inactive'   : 'show',
        'click .active'         : 'hide'
    },
    updatePost: function(e) {
        e.preventDefault();
        this.model.set({
            title: $('#titleInput').val(),
            content: $('#contentInput').val()
        });
        this.model.save(null, {
            success: function() {
                postRouter.navigate("",true);
            }
        });
    },
    back: function(e) {
        e.preventDefault();
        postRouter.navigate("", true);
    },
    show: function() {
        $(".hidden").addClass("show").removeClass("hidden");
        $(".inactive").addClass("active").removeClass("inactive");
        $(".plus").addClass("cross").removeClass("plus");
    },
    hide: function() {
        $(".show").addClass("hidden").removeClass("show");
        $(".active").addClass("inactive").removeClass("active");
        $(".cross").addClass("plus").removeClass("cross");
    },
    render: function() {
        html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;
    }
});

var PostRouter = Backbone.Router.extend({
    routes: {
        ""                  : "allPosts",
        "posts/new"         : "newPost",
        "posts/edit/:id"    : "editPost",
        "posts/:id"         : "postDetail"
    },
    showView: function(selector, view) {
        if (this.currentView)
        this.currentView.remove();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    },
    allPosts: function() {
        posts = new PostCollection();
        posts.fetch();
        this.showView('#content', new PostListView({ collection: posts }));
    },
    newPost: function() {
        posts = new PostCollection();
        posts.fetch();
        this.showView( '#content', new NewPostView({ collection: posts}));
    },
    editPost: function(id) {
        var post = posts.get(id);
        this.showView('#content', new EditPostView({ model: post }));
    },
    postDetail: function(id) {
        var post = posts.get(id); 
        this.showView('#content', new PostDetailView({ model: post }));
    }
});

posts = new PostCollection();
posts.fetch();
var postRouter = new PostRouter();
Backbone.history.start();