module.exports = class Order {
    constructor(email, title, image, rating, ingredients, price, status, starttime, endtime, cookingStarted, cookedIn) {
        this.email = email;
        this.title = title;
        this.image = image;
        this.rating = rating;
        this.ingredients = ingredients;
        this.price = price;
        this.status = status;
        this.starttime = starttime;
        this.endtime = endtime;
        this.cookingStarted = cookingStarted;
        this.cookedIn = cookedIn;
    }
};