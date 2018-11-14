/* 
* The given twitterGif is matched against all of the current user's favorites saved in the database.
* If a favorite has the same topic and gif id as the twitterGif, the twitterGif's liked status
* is changed to true and it's id is changed to the matched favorite's id
*/

function matchLikedStatusWithFavorites(favorites, twitterGif) {

  const { id, topic, gif } = twitterGif;
  
  for(let i = 0; i < favorites.length; i++) {
    if(favorites[i].gif.id === gif.id && favorites[i].topic === topic) {
      return {id: favorites[i].id, topic, gif, liked: true};
    }
  }
  return {id, topic, gif};
}

module.exports.matchLikedStatusWithFavorites = matchLikedStatusWithFavorites;