import React, { useState } from "react";
import "./flashcard.css";

function flashCard() {
  const [divFX, setDivFX] = useState<number>(window.innerWidth / 2);
  const [divFY, setDivFY] = useState<number>(window.innerHeight / 2);
  const [divBX, setDivBX] = useState<number>(window.innerWidth / 2);
  const [divBY, setDivBY] = useState<number>(window.innerHeight / 2);
  const [MouseDownBool, setMDBool] = useState<boolean>(false);
  const [SwipedBoolF, setSwipedBoolF] = useState<boolean>(false);
  const [SwipedBoolB, setSwipedBoolB] = useState<boolean>(false);
  const [CounterF, setCounterF] = useState<number>(1000);
  const [CounterB, setCounterB] = useState<number>(999);
  const [ImgCounterF, setImgCounterF] = useState<number>(1);
  const [ImgCounterB, setImgCounterB] = useState<number>(2);

  const positionFollowTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget.id);
    if (
      e.currentTarget.id == "front" &&
      CounterF > CounterB &&
      SwipedBoolF == false
    ) {
      setDivFX(e.touches[0].clientX);
      setDivFY(e.touches[0].clientY);
    } else if (
      e.currentTarget.id == "back" &&
      CounterB > CounterF &&
      SwipedBoolB == false
    ) {
      setDivBX(e.touches[0].clientX);
      setDivBY(e.touches[0].clientY);
    }
  };
  const positionFollowMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (MouseDownBool) {
      console.log(e.clientX, e.clientY);
      if (
        e.currentTarget.id == "front" &&
        CounterF > CounterB &&
        SwipedBoolF == false
      ) {
        setDivFX(e.clientX);
        setDivFY(e.clientY);
      } else if (
        e.currentTarget.id == "back" &&
        CounterB > CounterF &&
        SwipedBoolB == false
      ) {
        setDivBX(e.clientX);
        setDivBY(e.clientY);
      }
    }
  };

  const SwipeF = () => {
    setSwipedBoolF(true);
    var SlideInterval: number;
    var InternalCounterX = divFX;
    var InternalCounterY = divFY;
    if (divFX > window.innerWidth / 2 && divFY > window.innerHeight / 2) {
      SlideInterval = setInterval(() => {
        setDivFX(InternalCounterX + 1);
        setDivFY(InternalCounterY + 1);
        InternalCounterX += 1;
        InternalCounterY += 1;
      }, 10);
    } else if (
      divFX < window.innerWidth / 2 &&
      divFY < window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivFX(InternalCounterX - 1);
        setDivFY(InternalCounterY - 1);
        InternalCounterX -= 1;
        InternalCounterY -= 1;
      }, 10);
    } else if (
      divFX > window.innerWidth / 2 &&
      divFY < window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivFX(InternalCounterX + 1);
        setDivFY(InternalCounterY - 1);
        InternalCounterX += 1;
        InternalCounterY -= 1;
      }, 10);
    } else if (
      divFX < window.innerWidth / 2 &&
      divFY > window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivFX(InternalCounterX - 1);
        setDivFY(InternalCounterY + 1);
        InternalCounterX -= 1;
        InternalCounterY += 1;
      }, 10);
    }
    setTimeout(() => {
      clearInterval(SlideInterval);
      setSwipedBoolF(false);
      setDivFX(window.innerWidth / 2);
      setDivFY(window.innerHeight / 2);
      setImgCounterF(ImgCounterF + 2);
      setCounterF(CounterF - 2);
    }, 1000);
  };
  const SwipeB = () => {
    setSwipedBoolB(true);
    var SlideInterval: number;
    var InternalCounterX = divBX;
    var InternalCounterY = divBY;
    if (divBX > window.innerWidth / 2 && divBY > window.innerHeight / 2) {
      SlideInterval = setInterval(() => {
        setDivBX(InternalCounterX + 1);
        setDivBY(InternalCounterY + 1);
        InternalCounterX += 1;
        InternalCounterY += 1;
      }, 10);
    } else if (
      divBX < window.innerWidth / 2 &&
      divBY < window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivBX(InternalCounterX - 1);
        setDivBY(InternalCounterY - 1);
        InternalCounterX -= 1;
        InternalCounterY -= 1;
      }, 10);
    } else if (
      divBX > window.innerWidth / 2 &&
      divBY < window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivBX(InternalCounterX + 1);
        setDivBY(InternalCounterY - 1);
        InternalCounterX += 1;
        InternalCounterY -= 1;
      }, 10);
    } else if (
      divBX < window.innerWidth / 2 &&
      divBY > window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivBX(InternalCounterX - 1);
        setDivBY(InternalCounterY + 1);
        InternalCounterX -= 1;
        InternalCounterY += 1;
      }, 10);
    }
    setTimeout(() => {
      clearInterval(SlideInterval);
      setSwipedBoolB(false);
      setDivBX(window.innerWidth / 2);
      setDivBY(window.innerHeight / 2);
      setImgCounterB(ImgCounterB + 2);
      setCounterB(CounterB - 2);
    }, 1000);
  };

  return (
    <div className="body">
      <div
        id="front"
        className={`flashCardDiv ${SwipedBoolF ? "FadeOut" : ""}`}
        onTouchMove={(e) => {
          positionFollowTouch(e);
        }}
        onTouchEnd={SwipeF}
        onMouseDown={(e) => {
          positionFollowMouse(e), setMDBool(true);
        }}
        onMouseMove={(e) => {
          positionFollowMouse(e);
        }}
        onMouseUp={(e) => {
          positionFollowMouse(e), setMDBool(false), SwipeF();
        }}
        style={{ top: divFY, left: divFX, zIndex: CounterF }}
      >
        <div
          style={{
            backgroundImage: `url("../pictures/image (${ImgCounterF}).jpg")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: "blur(8px)",
            width: "100%",
            height: "100%",
          }}
        ></div>
        <img
          src={`../pictures/image (${ImgCounterF}).jpg`}
          width={window.innerWidth}
          height={window.innerHeight}
          draggable="false"
        ></img>
      </div>
      <div
        id="back"
        className={`flashCardDiv ${SwipedBoolB ? "FadeOut" : ""}`}
        onTouchMove={(e) => {
          positionFollowTouch(e);
        }}
        onTouchEnd={SwipeB}
        onMouseDown={(e) => {
          positionFollowMouse(e), setMDBool(true);
        }}
        onMouseMove={(e) => {
          positionFollowMouse(e);
        }}
        onMouseUp={(e) => {
          positionFollowMouse(e), setMDBool(false), SwipeB();
        }}
        style={{
          top: divBY,
          left: divBX,
          zIndex: CounterB,
        }}
      >
        <div
          style={{
            backgroundImage: `url("../pictures/image (${ImgCounterB}).jpg")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: "blur(8px)",
            width: "100%",
            height: "100%",
          }}
        ></div>
        <img
          src={`../pictures/image (${ImgCounterB}).jpg`}
          width={window.innerWidth}
          height={window.innerHeight}
          draggable="false"
        ></img>
      </div>
    </div>
  );
}

export default flashCard;
