Math.randInt = function(limit) {
  limit = typeof(limit) != 'undefined' ? limit : 100;
  return Math.floor(Math.random() * limit);
};