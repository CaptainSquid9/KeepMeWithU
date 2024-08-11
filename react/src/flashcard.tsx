import React, { useState, useEffect } from "react";
import "./flashcard.css";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS, { AES } from "crypto-js";

type ValuesObject = {
  [key: string]: number; // This allows indexing with numbers
};
type BoolsObject = {
  [key: string]: boolean; // This allows indexing with numbers
};
type StringObject = {
  [key: string]: string; // This allows indexing with numbers
};
var LoadedInternal = -1;

var CounterOut: ValuesObject;
function flashCard() {
  const navigate = useNavigate();

  var Timer: NodeJS.Timeout | undefined;
  var [IdleTimer, setIdleTimer] = useState<NodeJS.Timeout | undefined>();
  const [LoadedPictures, setLoadedPictures] = useState<number>(0);
  //position for each layer
  //Amount of layers to generate
  const Layers: number = 10;
  //Sent from picker
  const { folderId, Auth } = useParams();
  var accessToken: string;
  //X
  const [divX, setDivX] = useState<ValuesObject>({});

  //Y
  const [divY, setDivY] = useState<ValuesObject>({});

  const [MouseDownBool, setMDBool] = useState<boolean>(false);
  const [Allow, setAllow] = useState<boolean>(false);
  var AllowSlide = false;
  //Bool checking if swiped for each layer
  const [SwipedBool, setSwipedBool] = useState<BoolsObject>({});
  //Z-index counter for each layer
  const [Counter, setCounter] = useState<ValuesObject>({});

  const setCounterOut = setCounter;

  // Fetch random photo for each layer
  const [photoUrl, setPhotoUrl] = useState<StringObject>({});

  function Start(elem: number) {
    setLoadedPictures(LoadedPictures + 1);
    LoadedInternal += 1;
    console.log(`Loaded pictures: ${LoadedPictures}, ${LoadedInternal}`);
    if (LoadedPictures == Layers - 1 || LoadedInternal == Layers - 1) {
      setAllow(true);
      AllowSlide = true;
      Timer = setTimeout(() => {
        Swipe(0, false);
      }, 1000);
      setIdleTimer(Timer);
      console.log("Done");
    } else if (LoadedPictures < Layers - 1 || LoadedInternal < Layers - 1) {
      let strElem = elem.toString();
      console.log("positioning");
      //Set default
      setDivX((prevState) => ({
        ...prevState,
        [strElem]: window.innerWidth / 2,
      }));
      setDivY((prevState) => ({
        ...prevState,
        [strElem]: window.innerHeight / 2,
      }));
      setSwipedBool((prevState) => ({ ...prevState, [strElem]: false }));
      setCounterOut((prevState) => ({
        ...prevState,
        [strElem]: 214748364 - elem,
      }));
      CounterOut = { ...CounterOut, [strElem]: 214748364 - elem };
      console.log(CounterOut);
      // All images have been loaded: ALlow touch
    }
  }

  //Random photo
  // Called by every layer

  const fetchRandomPhoto = async (id: string) => {
    console.log(folderId);
    if (Auth) {
      accessToken = AES.decrypt(Auth, "TEST!NGPURP=S3S").toString(
        CryptoJS.enc.Utf8
      );
    }
    const response = await fetch(`/api/randomPhoto?folderId=${folderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const photoData = await response.json();
      const imageUrl = photoData.image;
      setPhotoUrl((prevState) => ({ ...prevState, [id]: imageUrl }));
    } else {
      console.error("Error fetching photo", response.statusText);
    }
  };
  useEffect(() => {
    if (!folderId) {
      navigate("/");
    }
    for (var i = 0; i < Layers; i++) {
      fetchRandomPhoto(i.toString());
      console.log("Fetching");
    }
  }, []);

  //Follow touch
  function positionFollowTouch(e: React.TouchEvent<HTMLDivElement>) {
    if (Allow) {
      const id = Number(e.currentTarget.id);
      const StrID = id.toString();

      clearTimeout(IdleTimer);
      clearTimeout(Timer);

      if (SwipedBool[id] == false) {
        setDivX((prevState) => ({
          ...prevState,
          [StrID]: e.touches[0].clientX,
        }));
        setDivY((prevState) => ({
          ...prevState,
          [StrID]: e.touches[0].clientY,
        }));
      }
    }
  }

  //Follow mouse
  function positionFollowMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (Allow && MouseDownBool) {
      const id = Number(e.currentTarget.id);
      const StrID = id.toString();
      clearTimeout(IdleTimer);
      clearTimeout(Timer);
      if (SwipedBool[id] == false) {
        setDivX((prevState) => ({ ...prevState, [StrID]: e.clientX }));
        setDivY((prevState) => ({ ...prevState, [StrID]: e.clientY }));
      }
    }
  }

  //Swipe animations

  function Swipe(id: number, update: boolean) {
    if ((AllowSlide == true || Allow == true) && update == false) {
      var SlideInterval: NodeJS.Timeout;
      var InternalCounterX = divX[id];
      var InternalCounterY = divY[id];
      const StrID = id.toString();

      clearTimeout(IdleTimer);
      clearTimeout(Timer);
      setAllow(true);
      setSwipedBool((prevState) => ({ ...prevState, [StrID]: true }));

      //Move flash card on one of the four diagonals depending on quadrile
      if (
        divX[id] > window.innerWidth / 2 &&
        divY[id] > window.innerHeight / 2
      ) {
        SlideInterval = setInterval(() => {
          setDivX((prevState) => ({ ...prevState, [StrID]: InternalCounterX }));
          setDivY((prevState) => ({ ...prevState, [StrID]: InternalCounterY }));
          InternalCounterX += 1;
          InternalCounterY += 1;
        }, 100);
      } else if (
        divX[id] < window.innerWidth / 2 &&
        divY[id] < window.innerHeight / 2
      ) {
        SlideInterval = setInterval(() => {
          setDivX((prevState) => ({ ...prevState, [StrID]: InternalCounterX }));
          setDivY((prevState) => ({ ...prevState, [StrID]: InternalCounterY }));
          InternalCounterX -= 1;
          InternalCounterY -= 1;
        }, 100);
      } else if (
        divX[id] > window.innerWidth / 2 &&
        divY[id] < window.innerHeight / 2
      ) {
        SlideInterval = setInterval(() => {
          setDivX((prevState) => ({ ...prevState, [StrID]: InternalCounterX }));
          setDivY((prevState) => ({ ...prevState, [StrID]: InternalCounterY }));
          InternalCounterX += 1;
          InternalCounterY -= 1;
        }, 100);
      } else {
        SlideInterval = setInterval(() => {
          setDivX((prevState) => ({ ...prevState, [StrID]: InternalCounterX }));
          setDivY((prevState) => ({ ...prevState, [StrID]: InternalCounterY }));
          InternalCounterX -= 1;
          InternalCounterY += 1;
        }, 100);
      }

      Timer = setTimeout(() => {
        if (id == 9) {
          Swipe(0, false);
        } else {
          Swipe(id + 1, false);
        }
      }, 4000);

      setIdleTimer(Timer);

      //Once animation is done
      setTimeout(() => {
        clearInterval(SlideInterval);
        setSwipedBool((prevState) => ({ ...prevState, [StrID]: false }));
        fetchRandomPhoto(StrID);
        setDivX((prevState) => ({
          ...prevState,
          [StrID]: window.innerWidth / 2,
        }));
        setDivY((prevState) => ({
          ...prevState,
          [StrID]: window.innerHeight / 2,
        }));
        setCounterOut((prevState) => ({
          ...prevState,
          [StrID]: CounterOut[id] - Layers,
        }));
        CounterOut = { ...CounterOut, [StrID]: CounterOut[id] - Layers };
      }, 1000);
      console.log(`Updated: ${CounterOut[id]}`);
    }
  }

  return (
    <div className="body">
      {[...Array(Layers)].map((Layer, i) => {
        return (
          <div
            id={i.toString()}
            className={`flashCardDiv ${SwipedBool[i] ? "FadeOut" : ""}`}
            onTouchMove={(e) => {
              positionFollowTouch(e),
                clearTimeout(IdleTimer),
                clearTimeout(Timer);
            }}
            onTouchEnd={() => {
              Swipe(i, false);
            }}
            onMouseDown={(e) => {
              setMDBool(true),
                positionFollowMouse(e),
                clearTimeout(IdleTimer),
                clearTimeout(Timer);
            }}
            onMouseMove={(e) => {
              positionFollowMouse(e);
            }}
            onMouseUp={(e) => {
              setMDBool(false), positionFollowMouse(e), Swipe(i, false);
            }}
            style={{ top: divY[i], left: divX[i], zIndex: Counter[i] }}
          >
            <div
              style={{
                backgroundImage: `url("${photoUrl[i]}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                filter: "blur(8px)",
                width: "100%",
                height: "100%",
              }}
            ></div>
            <img
              src={photoUrl[i]}
              width={window.innerWidth}
              height={window.innerHeight}
              draggable="false"
              onLoad={() => {
                Start(i);
              }}
              onChange={() => {
                Swipe(i, true);
              }}
            ></img>
          </div>
        );
      })}
    </div>
  );
}

export default flashCard;
