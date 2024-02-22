//global variable
let currentSong = new Audio();
let songs;
let currentFolder;
// ........................................................................................................................................................
//function to convert seconds to minutes
function secToMinSec(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}
//..........................................................................................................................................................

//fetch songs from folder and returning songs array
async function getSongs(folder) {
  currentFolder = folder;

  let fetchSongs = await fetch(`songs2/${folder}/`); 
  let response = await fetchSongs.text(); 
  let div = document.createElement("div");
  div.innerHTML = response;
  let allanchor = div.getElementsByTagName("a");
  let songs = []; 
  for (let i = 0; i < allanchor.length; i++) {
    
    const element = allanchor[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

  //replacing the songs array filled with links to their names
  //and putting them into library on left container

  let playlistContainer =
  document.getElementsByClassName("playlistContainer")[0];
  playlistContainer.innerHTML = ""

  for (let i = 0; i < songs.length; i++) {
    //making the heading for songname by splitting the array of songs

    let songname = songs[i]
      .split(`${currentFolder}/`)[1]
      .replaceAll("%20", " ")
      .replaceAll("%5D", "")
      .replaceAll("%5B", "")
      .replaceAll(".mp3", "")
      .replaceAll("%26", "");

    //making the heading for artist name by splitting the array of songs
    let artistname = songs[i]
      .split(`${currentFolder}/`)[1]
      .split("-")[0]
      .replaceAll("%20", " ")
      .replaceAll("%5D", "")
      .replaceAll("%5B", "")
      .replaceAll(".mp3", "")
      .replaceAll("%26", "");

      
    //creating the containers and inputting the songname and artistname
      playlistContainer.innerHTML = playlistContainer.innerHTML +
      `<div class="playContent">
        <img src="./svg/music.svg" alt="">
          <div class="content-name">
            <div class="songname">${songname}</div>
            <div class="artist">${artistname}</div>
          </div>
       <img src="./svg/play.svg" alt="">
      </div>`;
  }
  
  //attach eventlistner to each song in library on left side
  let a = document
    .getElementsByClassName("playlistContainer")[0]
    .getElementsByClassName("playContent");

  Array.from(a).forEach((a) => {
    a.addEventListener("click", () => {
      playMusic(
        a
          .getElementsByClassName("content-name")[0]
          .getElementsByClassName("songname")[0]
          .innerHTML.trim()
      );
    });
  });

  //all the songs are stored in Songs array
  return songs;
}

//..........................................................................................................................................................

//take track and play music
const playMusic = (track) => {
  // console.log(track);
  currentSong.src = `songs2/${currentFolder}/` + track + ".mp3";
  currentSong.play();
  play.src = "svg/pause.svg";

  let songinfo = document.getElementsByClassName("songheading");
  // console.log(songinfo[0])
  songinfo[0].innerHTML = track;
};

//.........................................................................................................................................................
async function displayAlbums(){


let fetchSongs = await fetch(`songs2/`);
  let response = await fetchSongs.text(); 
  let div = document.createElement("div"); 
  div.innerHTML = response
  let anchors = div.getElementsByTagName('a')
  let playlistscards = document.getElementsByClassName("playlistscards")[0]
  console.log(playlistscards)

  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
      console.log(e);
    if(e.href.includes("songs2/") && !e.href.includes(".htaccess")){

      let folder = e.href.split('/').slice(-1)[0]
      console.log(folder);
      //get the metadata of the folder
      let fetchSongs = await fetch(`songs2/${folder}/info.json`);
      let response = await fetchSongs.json(); 
      console.log(response);
        playlistscards.innerHTML = playlistscards.innerHTML + 
                          `<div data-folder="${folder}" class="card">
                          <img src="/songs2/${folder}/cover.jpg" alt="">
                          <h2>${response.title}</h2>
                          <p>${response.description}</p>
                          <!-- <div class="play"><img src="play.svg" alt=""></div> -->
                      </div>`
    }
  }

//adding eventListner to card
Array.from(document.getElementsByClassName("card")).forEach(e => { 
  e.addEventListener("click", async item => {
      songs = await getSongs(`${item.currentTarget.dataset.folder}`)  
  })
})

}

//.........................................................................................................................................................
async function main() {

  //array of links of all the songs....getting from line 35
  await getSongs('ncs');
  
  //albums
  await displayAlbums()
  
  // attach eventListner to play pause and previous buttons on playbar
  let previous = document.getElementById("previous");
  let play = document.getElementById("play");
  let next = document.getElementById("next");

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svg/play2.svg";
    }
  });

  //add eventlistner to update the song and move the seek circle
  currentSong.addEventListener("timeupdate", () => {
    document.getElementsByClassName("songtime")[0].innerHTML = `${secToMinSec(
      currentSong.currentTime
    )} | ${secToMinSec(currentSong.duration)} `;
    let seekcircle = document.querySelector(".seekcircle");
    seekcircle.style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //add eventlistner to make the seek circle work
  let seekbar = document.querySelector(".seekbar");
  seekbar.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".seekcircle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //add eventListener to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  //add eventListener to close/cross
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  //adding eventListner to the Previous Button on Playbar
  previous.addEventListener("click", () => {
    let currentIndex = songs.indexOf(currentSong.src);
    if (currentIndex > 0) {
      playMusic(
        songs[currentIndex - 1]
          .split(`${currentFolder}/`)[1]
          .split(".mp3")[0]
          .replaceAll("%20", " ")
          .replaceAll("%5D", "")
          .replaceAll("%5B", "")
          .replaceAll(".mp3", "")
          .replaceAll("%26", "")
      );
    }
  });

  //adding eventListner to the Next Button on Playbar
  next.addEventListener("click", () => {
    let currentIndex = songs.indexOf(currentSong.src);
    if (currentIndex < songs.length) {
      playMusic(
        songs[currentIndex + 1]
          .split(`${currentFolder}/`)[1]
          .split(".mp3")[0]
          .replaceAll("%20", " ")
          .replaceAll("%5D", "")
          .replaceAll("%5B", "")
          .replaceAll(".mp3", "")
          .replaceAll("%26", "")
      );
    }
  });

  //add eventListner to change volume
  document.querySelector(".range").addEventListener("change", (e) => {
    console.log(e.target.value);
    currentSong.volume = e.target.value / 100;
  });

}

main();
