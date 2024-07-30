import React, { useState, useEffect } from "react";
import axios from "axios";
import "./flashcard.css";

function flashCard() {
  //position for each layer

  //X
  const [divX1, setDivX1] = useState<number>(window.innerWidth / 2);
  const [divX2, setDivX2] = useState<number>(window.innerWidth / 2);
  const [divX3, setDivX3] = useState<number>(window.innerWidth / 2);
  const [divX4, setDivX4] = useState<number>(window.innerWidth / 2);

  const setDivX = [setDivX1, setDivX2, setDivX3, setDivX4];
  const DivX = [divX1, divX2, divX3, divX4];

  //Y
  const [divY1, setDivY1] = useState<number>(window.innerHeight / 2);
  const [divY2, setDivY2] = useState<number>(window.innerHeight / 2);
  const [divY3, setDivY3] = useState<number>(window.innerHeight / 2);
  const [divY4, setDivY4] = useState<number>(window.innerHeight / 2);

  const setDivY = [setDivY1, setDivY2, setDivY3, setDivY4];
  const DivY = [divY1, divY2, divY3, divY4];

  const [MouseDownBool, setMDBool] = useState<boolean>(false);

  //Bool checking if swiped for each layer
  const [SwipedBool1, setSwipedBool1] = useState<boolean>(false);
  const [SwipedBool2, setSwipedBool2] = useState<boolean>(false);
  const [SwipedBool3, setSwipedBool3] = useState<boolean>(false);
  const [SwipedBool4, setSwipedBool4] = useState<boolean>(false);

  const setSwipedBool = [
    setSwipedBool1,
    setSwipedBool2,
    setSwipedBool3,
    setSwipedBool4,
  ];
  const SwipedBool = [SwipedBool1, SwipedBool2, SwipedBool3, SwipedBool4];
  //Z-index counter for each layer
  const [Counter1, setCounter1] = useState<number>(1000);
  const [Counter2, setCounter2] = useState<number>(999);
  const [Counter3, setCounter3] = useState<number>(998);
  const [Counter4, setCounter4] = useState<number>(997);

  const setCounter = [setCounter1, setCounter2, setCounter3, setCounter4];
  const Counter = [Counter1, Counter2, Counter3, Counter4];
  //const [ImgCounterF, setImgCounterF] = useState<number>(1);
  //const [ImgCounterB, setImgCounterB] = useState<number>(2);

  // Fetch random photo for each layer

  const [photoUrl1, setPhotoUrl1] = useState<string | undefined>(undefined);
  const [photoUrl2, setPhotoUrl2] = useState<string | undefined>(undefined);
  const [photoUrl3, setPhotoUrl3] = useState<string | undefined>(undefined);
  const [photoUrl4, setPhotoUrl4] = useState<string | undefined>(undefined);

  const setPhotoUrl = [setPhotoUrl1, setPhotoUrl2, setPhotoUrl3, setPhotoUrl4];

  //Random photo
  // Called by every layer

  const fetchRandomPhoto = async (id: number) => {
    try {
      const response = await axios.get("/api/randomPhoto", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included if needed
      });
      const photoId = response.data.photoId;
      const func = setPhotoUrl[id];
      func(`https://drive.google.com/uc?id=${photoId}`);
    } catch (error) {
      console.error("Error fetching photo", error);
    }
  };
  useEffect(() => {
    for (var i = 0; i < 4; i++) {
      fetchRandomPhoto(i);
    }
  }, []);

  //Follow touch
  const positionFollowTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget.id);
    const id = Number(e.currentTarget.id) - 1;
    var back;
    if (id == 0) {
      back = 3;
    } else {
      back = id - 1;
    }
    const funcY = setDivY[id];
    const funcX = setDivX[id];

    if (Counter[id] > Counter[back] && SwipedBool[id] == false) {
      funcX(e.touches[0].clientX);
      funcY(e.touches[0].clientY);
    }
  };

  //Follow mouse
  const positionFollowMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (MouseDownBool) {
      console.log(e.clientX, e.clientY);
      const id = Number(e.currentTarget.id) - 1;

      var back;
      if (id == 0) {
        back = 3;
      } else {
        back = id - 1;
      }
      const funcY = setDivY[id];
      const funcX = setDivX[id];

      if (Counter[id] > Counter[back] && SwipedBool[id] == false) {
        funcX(e.clientX);
        funcY(e.clientY);
      }
    }
  };

  //Swipe animations

  const Swipe = (rawID: number) => {
    const id = rawID - 1;

    const funcBool = setSwipedBool[id];
    const funcDivX = setDivX[id];
    const funcDivY = setDivY[id];
    const funcCounter = setCounter[id];

    funcBool(true);

    var SlideInterval: number;
    var InternalCounterX = DivX[id];
    var InternalCounterY = DivY[id];

    //Move flash card on one of the four diagonals depending on quadrile
    if (DivX[id] > window.innerWidth / 2 && DivY[id] > window.innerHeight / 2) {
      SlideInterval = setInterval(() => {
        funcDivX(InternalCounterX + 1);
        funcDivY(InternalCounterY + 1);
        InternalCounterX += 1;
        InternalCounterY += 1;
      }, 10);
    } else if (
      DivX[id] < window.innerWidth / 2 &&
      DivY[id] < window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        funcDivX(InternalCounterX - 1);
        funcDivY(InternalCounterY - 1);
        InternalCounterX -= 1;
        InternalCounterY -= 1;
      }, 10);
    } else if (
      DivX[id] > window.innerWidth / 2 &&
      DivY[id] < window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        funcDivX(InternalCounterX + 1);
        funcDivY(InternalCounterY - 1);
        InternalCounterX += 1;
        InternalCounterY -= 1;
      }, 10);
    } else if (
      DivX[id] < window.innerWidth / 2 &&
      DivY[id] > window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        funcDivX(InternalCounterX - 1);
        funcDivY(InternalCounterY + 1);
        InternalCounterX -= 1;
        InternalCounterY += 1;
      }, 10);
    }

    //Once animation is done
    setTimeout(() => {
      clearInterval(SlideInterval);
      funcBool(false);
      fetchRandomPhoto(id);
      funcDivX(window.innerWidth / 2);
      funcDivY(window.innerHeight / 2);
      // setImgCounterF(ImgCounterF + 2);
      funcCounter(Counter[id] - 2);
    }, 1000);
  };
  return (
    <div className="body">
      <div
        id="1"
        className={`flashCardDiv ${SwipedBool1 ? "FadeOut" : ""}`}
        onTouchMove={(e) => {
          positionFollowTouch(e);
        }}
        onTouchEnd={() => {
          Swipe(1);
        }}
        onMouseDown={(e) => {
          positionFollowMouse(e), setMDBool(true);
        }}
        onMouseMove={(e) => {
          positionFollowMouse(e);
        }}
        onMouseUp={(e) => {
          positionFollowMouse(e), setMDBool(false), Swipe(1);
        }}
        style={{ top: divY1, left: divX1, zIndex: Counter1 }}
      >
        <div
          style={{
            backgroundImage: `url("${photoUrl1}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: "blur(8px)",
            width: "100%",
            height: "100%",
          }}
        ></div>
        <img
          src={photoUrl1}
          width={window.innerWidth}
          height={window.innerHeight}
          draggable="false"
          /**        onError={() => {
            fetchRandomPhoto(0);
          }}
*/
        ></img>
      </div>
      <div
        id="2"
        className={`flashCardDiv ${SwipedBool2 ? "FadeOut" : ""}`}
        onTouchMove={(e) => {
          positionFollowTouch(e);
        }}
        onTouchEnd={() => {
          Swipe(2);
        }}
        onMouseDown={(e) => {
          positionFollowMouse(e), setMDBool(true);
        }}
        onMouseMove={(e) => {
          positionFollowMouse(e);
        }}
        onMouseUp={(e) => {
          positionFollowMouse(e), setMDBool(false), Swipe(2);
        }}
        style={{
          top: divY2,
          left: divX2,
          zIndex: Counter2,
        }}
      >
        <div
          style={{
            backgroundImage: `url("${photoUrl2}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: "blur(8px)",
            width: "100%",
            height: "100%",
          }}
        ></div>
        <img
          src={photoUrl2}
          width={window.innerWidth}
          height={window.innerHeight}
          draggable="false"
          /**        onError={() => {
            fetchRandomPhoto(0);
          }}
*/
        ></img>
      </div>
      <div
        id="3"
        className={`flashCardDiv ${SwipedBool3 ? "FadeOut" : ""}`}
        onTouchMove={(e) => {
          positionFollowTouch(e);
        }}
        onTouchEnd={() => {
          Swipe(3);
        }}
        onMouseDown={(e) => {
          positionFollowMouse(e), setMDBool(true);
        }}
        onMouseMove={(e) => {
          positionFollowMouse(e);
        }}
        onMouseUp={(e) => {
          positionFollowMouse(e), setMDBool(false), Swipe(3);
        }}
        style={{ top: divY3, left: divX3, zIndex: Counter3 }}
      >
        <div
          style={{
            backgroundImage: `url("${photoUrl3}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: "blur(8px)",
            width: "100%",
            height: "100%",
          }}
        ></div>
        <img
          src={photoUrl3}
          width={window.innerWidth}
          height={window.innerHeight}
          draggable="false"
          /**        onError={() => {
            fetchRandomPhoto(0);
          }}
*/
        ></img>
      </div>
      <div
        id="4"
        className={`flashCardDiv ${SwipedBool4 ? "FadeOut" : ""}`}
        onTouchMove={(e) => {
          positionFollowTouch(e);
        }}
        onTouchEnd={() => {
          Swipe(4);
        }}
        onMouseDown={(e) => {
          positionFollowMouse(e), setMDBool(true);
        }}
        onMouseMove={(e) => {
          positionFollowMouse(e);
        }}
        onMouseUp={(e) => {
          positionFollowMouse(e), setMDBool(false), Swipe(4);
        }}
        style={{
          top: divY4,
          left: divX4,
          zIndex: Counter4,
        }}
      >
        <div
          style={{
            backgroundImage: `url("${photoUrl4}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: "blur(8px)",
            width: "100%",
            height: "100%",
          }}
        ></div>
        <img
          src={photoUrl4}
          width={window.innerWidth}
          height={window.innerHeight}
          draggable="false"
          /**        onError={() => {
            fetchRandomPhoto(0);
          }}
*/
        ></img>
      </div>
    </div>
  );
}

export default flashCard;
