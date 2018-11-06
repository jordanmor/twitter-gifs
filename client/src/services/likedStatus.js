// Check each card with cards saved in favorites. If topic and gif id match, the card status is liked
// Card is also given id of favorite saved in database
function matchLikedStatusWithFavorites(favorites, id, topic, gif) {
  
  for(let i = 0; i < favorites.length; i++) {

    if(favorites[i].gif.id === gif.id && favorites[i].topic === topic) {
      return {id: favorites[i].id, topic, gif, liked: true};
    }
  }
  return {id, topic, gif};
}

module.exports.matchLikedStatusWithFavorites = matchLikedStatusWithFavorites;