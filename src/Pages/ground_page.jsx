import React, { useEffect, useState } from "react";
import { MUINavbar, MUILoggedNavbar } from "../Components/Navbar";
import logo from "../Components/Forms/logo-black.png";
import { SlotsSidebar } from "../Components/Sidebars";
import { SlotSelectCard } from "../Components/Cards";
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { Info, Schedule, LocationOn } from "@mui/icons-material";
import { SlotsDropdown } from "../Components/DropdownMenu";
import axios from "axios";

const Ground_page = () => {
  const [groundName, setGroundName] = useState("");
  const [groundInfo, setGroundInfo] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [selectedSlots, setSelectedSlots] = useState([]);

  function addSelectedSlot(index) {
    setSelectedSlots((prevSelectedSlots) => {
      // check if the slot is already in the array
      const isSelected = prevSelectedSlots.some(
        (slot) => slot._id === slots[index]._id
      );
      // if the slot is not selected, add it to the array
      if (!isSelected) {
        return [...prevSelectedSlots, slots[index]];
      }
      // if the slot is already selected, remove it from the array
      return prevSelectedSlots.filter((slot) => slot._id !== slots[index]._id);
    });
  }

  function handleDateChange(event) {
    setSelectedDate(event.target.value);
  }

  useEffect(() => {
    const path = window.location.pathname.substring(1); // removes the leading slash

    axios
      .get(`http://localhost:3001/${path}`)
      .then((response) => {
        setGroundName(response.data.groundName);
        setSlots(response.data.slots);
        setGroundInfo(response.data.groundInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {<MUINavbar logo={logo} />}
      {<MUILoggedNavbar logo={logo} />}
      <SlotsSidebar />
      {/* ground info div */}
      <div className="grounds-info-div">
        <Card sx={{ width: "100%", borderRadius: "20px" }}>
          <CardMedia
            component="img"
            height="400"
            image="https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Ground Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {groundName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Info sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {groundInfo ? groundInfo : "Ground information not available"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Schedule sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {`Bookings for ${groundName} must be made a
                minimum of 24 hours before the booking is to take place.`}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOn sx={{ mr: 1 }} />
              <Link
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                color="text.secondary"
              >
                {`View ${groundName} on Google Maps.`}
              </Link>
            </Box>
          </CardContent>
        </Card>
      </div>
      {/* ground's slots div */}
      <div className="slots-select-card">
        <Card sx={{ width: "100%", borderRadius: "20px" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Select your slots
            </Typography>
            <div style={{ marginTop: "20px", padding: "10px" }}>
              {slots.map((slot, index) => (
                <div
                  className="slots-div"
                  onClick={() => addSelectedSlot(index)}
                  key={slot._id}
                  style={{
                    backgroundColor: selectedSlots.some(
                      (selected) => selected._id === slot._id
                    )
                      ? "#00ffef"
                      : "#00ff6a",
                  }}
                >
                  <span>{slot.dayOfWeek}</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "2px",
                        height: "20px",
                        backgroundColor: "black",
                        marginRight: "10px",
                      }}
                    ></div>
                    <span>{`${slot.startTime} - ${slot.endTime}`}</span>
                    <div
                      style={{
                        width: "1.8px",
                        height: "20px",
                        backgroundColor: "black",
                        margin: "0px 10px",
                      }}
                    ></div>
                    <span>{`Rs.${slot.rate}`}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          {/* select date and time */}
          <Box
            sx={{
              // display: "flex",
              backgroundImage: "url('')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "400px",
            }}
          >
            <Box sx={{ width: "50%" }}>
              <Typography
                variant="h5"
                component="div"
                sx={{ marginTop: "20px", marginLeft: "10px" }}
              >
                Select Date:
              </Typography>
              <input
                style={{ marginTop: "20px", marginLeft: "15px" }}
                type="date"
                id="date"
                name="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              <Typography
                variant="h5"
                component="div"
                sx={{ marginTop: "20px" }}
              >
                Select Time:
              </Typography>
              <SlotsDropdown
                slots={slots}
                onChange={(selectedValue) => {
                  setSelectedTime(selectedValue);
                }}
              />
            </Box>
          </Box>
          {/* get date and time button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const today = new Date().toLocaleDateString();
              setCurrentDate(today);

              console.log(currentDate);
              console.log(selectedSlots);
            }}
            sx={{ marginTop: "20px" }}
          >
            Get Date and Time
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Ground_page;
