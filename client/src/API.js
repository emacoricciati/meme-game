

const baseURL = 'http://localhost:3001/api';


const handleInvalidResponse =  (response) => {
    if(!response.ok){
        throw Error(response.statusText);
    }
    const type = response.headers.get('content-type');
    if(type !== null && type.indexOf('application/json') === -1){
        throw new TypeError(`Expected JSON, got ${type}`);
    }
    return response;

};

// get random meme
// TODO Map response to Image object
export const getRandomMeme = async (images) => {
    if(!images){
        images = [];
    } 
    const excludedIds = images.map(image => image.id);
    const excludedIdsQueryString = excludedIds.length ? '?ids=' + excludedIds.join(',') : '';
  const response = await fetch(`${baseURL}/memes/random${excludedIdsQueryString}`, {credentials: 'include'})
  .then(handleInvalidResponse)
  .then(response => response.json());
    return response;
};

// login
export const login = async (credentials) => {
    return await fetch(baseURL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

// get user info
export const getUserInfo = async () => {
    return await fetch(baseURL + '/sessions/current', {
        credentials: 'include'
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

// logout
export const logout = async() => {
    return await fetch(baseURL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleInvalidResponse);
  }

  // post game
    export const postGame = async (game) => {
        await fetch(baseURL + '/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(game),
        }).then(handleInvalidResponse)
    };

    // get games
    export const getGames = async () => {
        return await fetch(baseURL + '/games', {
            credentials: 'include'
        }).then(handleInvalidResponse)
        .then(response => response.json());
    };

    // get game
    export const getGame = async (gameId) => {
        return await fetch(baseURL + '/games/' + gameId, {
            credentials: 'include'
        }).then(handleInvalidResponse)
        .then(response => response.json());
    };

    // get total points
    export const getTotalPoints = async () => {
        return await fetch(baseURL + '/user/points', {
            credentials: 'include'
        }).then(handleInvalidResponse)
        .then(response => response.json());
    };

    // get unlocked memes
    export const getUnlockedMemes = async () => {
        return await fetch(baseURL + '/user/memes/unlocked', {
            credentials: 'include'
        }).then(handleInvalidResponse)
        .then(response => response.json());
    };