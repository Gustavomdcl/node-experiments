//https://www.w3schools.com/js/js_date_methods.asp
//https://www.w3schools.com/js/js_date_formats.asp
var date = new Date();
date = new Date("2015-03-25");
date = new Date("March 21, 2012");
date = new Date();
var format = date.getFullYear()+''+date.getMonth()+''+date.getDate();
console.log(date);
console.log(format);