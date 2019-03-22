$(document).ready(function(){
  const Url = 'http://localhost:3000/gPosts';
  $.ajax({
    url: Url,
    type: "GET",
    success: function(result){
      console.log(result)
    },
    error: function(error){
      console.log('Error ${error}')
    }
  })
})
