
// Get tags from post content. This is the api that I write for user cards. Each user post has tags that tells what the post is about. 
export const detectTags = (content,character) => {

  return content.split(" ").filter((word) => {
    return (word.slice(0,1) === character)
  })

}
export const getContentTags = (content) => {
  let newTags = []
  let tags =  detectTags(content,'#')
  tags.forEach((tag)=>{
    newTags.push(tag.slice(1))
  })
  return newTags
}

export const sortObjectsDate = (objects) => {
    let sortedObjects = objects

     // Sort posts with creation date
     sortedObjects.sort((a, b) => {
      return  parseInt(b.creationDate) - parseInt(a.creationDate)

    })

    return sortedObjects
  }