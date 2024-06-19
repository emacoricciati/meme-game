

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
// TO DO Map response to Image object
export const getRandomMeme = async (images) => {
    if(!images){
        images = [];
    } 
    const excludedIds = images.map(image => image.id);
    const excludedIdsQueryString = excludedIds.length ? '?' + excludedIds.join(',') : '';
  const response = await fetch(`${baseURL}/images${excludedIdsQueryString}`, {credentials: 'include'})
  .then(handleInvalidResponse)
  .then(response => response.json());
    return response;
};