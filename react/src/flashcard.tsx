import React, { useState, useEffect } from "react";
import axios from "axios";
import "./flashcard.css";

function flashCard() {
  type ValuesObject = {
    [key: string]: number; // This allows indexing with numbers
  };
  type BoolsObject = {
    [key: string]: boolean; // This allows indexing with numbers
  };
  type StringObject = {
    [key: string]: string; // This allows indexing with numbers
  };

  //position for each layer
  //Amount of layers to generate
  const [Layers, setLayers] = useState<number>(10);

  //X
  const [divX, setDivX] = useState<ValuesObject>({});

  //Y
  const [divY, setDivY] = useState<ValuesObject>({});

  const [MouseDownBool, setMDBool] = useState<boolean>(false);

  //Bool checking if swiped for each layer
  const [SwipedBool, setSwipedBool] = useState<BoolsObject>({});
  //Z-index counter for each layer
  const [Counter, setCounter] = useState<ValuesObject>({});

  //const [ImgCounterF, setImgCounterF] = useState<number>(1);
  //const [ImgCounterB, setImgCounterB] = useState<number>(2);

  // Fetch random photo for each layer
  const [photoUrl, setPhotoUrl] = useState<StringObject>({});

  for (const elem in Array(Layers)) {
    setDivX({ ...divX, [elem]: window.innerWidth / 2 });
    setDivY({ ...divY, [elem]: window.innerHeight / 2 });
    setSwipedBool({ ...SwipedBool, [elem]: false });
    setCounter({ ...Counter, [elem]: 1000 - Number(elem) });
    setPhotoUrl({ ...photoUrl, [elem]: "" });
  }

  //Random photo
  // Called by every layer

  const fetchRandomPhoto = async (id: string) => {
    try {
      const response = await axios.get("/api/randomPhoto", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensure credentials are included if needed
        responseType: "blob",
      });
      const imageUrl = URL.createObjectURL(response.data);
      setPhotoUrl({ ...photoUrl, [id]: imageUrl });
    } catch (error) {
      console.error("Error fetching photo", error);
    }
  };
  useEffect(() => {
    for (var i = 0; i < Layers; i++) {
      fetchRandomPhoto(String(i));
    }
  }, []);

  //Follow touch
  const positionFollowTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget.id);
    const id = Number(e.currentTarget.id);
    var back;
    if (id == 0) {
      back = Layers;
    } else {
      back = id;
    }

    if (Counter[id] > Counter[back] && SwipedBool[id] == false) {
      setDivX({ ...divX, [id]: e.touches[0].clientX });
      setDivY({ ...divY, [id]: e.touches[0].clientY });
    }
  };

  //Follow mouse
  const positionFollowMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (MouseDownBool) {
      console.log(e.clientX, e.clientY);
      const id = Number(e.currentTarget.id);

      var back;
      if (id == 0) {
        back = Layers;
      } else {
        back = id;
      }
      if (Counter[id] > Counter[back] && SwipedBool[id] == false) {
        setDivX({ ...divX, [id]: e.clientX });
        setDivY({ ...divY, [id]: e.clientY });
      }
    }
  };

  //Swipe animations

  const Swipe = (id: number) => {
    setSwipedBool({ id: true });

    var SlideInterval: number;
    var InternalCounterX = divX[id];
    var InternalCounterY = divY[id];

    //Move flash card on one of the four diagonals depending on quadrile
    if (divX[id] > window.innerWidth / 2 && divY[id] > window.innerHeight / 2) {
      SlideInterval = setInterval(() => {
        setDivX({ ...divX, [id]: InternalCounterX });
        setDivY({ ...divY, [id]: InternalCounterY });
        InternalCounterX += 1;
        InternalCounterY += 1;
      }, 10);
    } else if (
      divX[id] < window.innerWidth / 2 &&
      divY[id] < window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivX({ ...divX, [id]: InternalCounterX });
        setDivY({ ...divY, [id]: InternalCounterY });
        InternalCounterX -= 1;
        InternalCounterY -= 1;
      }, 10);
    } else if (
      divX[id] > window.innerWidth / 2 &&
      divY[id] < window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivX({ ...divX, [id]: InternalCounterX });
        setDivY({ ...divY, [id]: InternalCounterY });
        InternalCounterX += 1;
        InternalCounterY -= 1;
      }, 10);
    } else if (
      divX[id] < window.innerWidth / 2 &&
      divY[id] > window.innerHeight / 2
    ) {
      SlideInterval = setInterval(() => {
        setDivX({ ...divX, [id]: InternalCounterX });
        setDivY({ ...divY, [id]: InternalCounterY });
        InternalCounterX -= 1;
        InternalCounterY += 1;
      }, 10);
    }

    //Once animation is done
    setTimeout(() => {
      clearInterval(SlideInterval);
      setSwipedBool({ ...SwipedBool, id: false });
      fetchRandomPhoto(String(id));
      setDivX({ ...divX, [id]: window.innerWidth / 2 });
      setDivY({ ...divY, [id]: window.innerHeight / 2 });
      // setImgCounterF(ImgCounterF + 2);
      setCounter({ ...Counter, [id]: [Counter[id] - 2] });
    }, 1000);
  };
  return (
    <div className="body">
      {[...Array(Layers)].map((Layer, i) => {
        return (
          <div
            id={String(i)}
            className={`flashCardDiv ${SwipedBool[i] ? "FadeOut" : ""}`}
            onTouchMove={(e) => {
              positionFollowTouch(e);
            }}
            onTouchEnd={() => {
              Swipe(i);
            }}
            onMouseDown={(e) => {
              positionFollowMouse(e), setMDBool(true);
            }}
            onMouseMove={(e) => {
              positionFollowMouse(e);
            }}
            onMouseUp={(e) => {
              positionFollowMouse(e), setMDBool(false), Swipe(i);
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
              onError={() => {
                fetchRandomPhoto(String(i));
              }}
            ></img>
          </div>
        );
      })}
    </div>
  );
}

export default flashCard;
