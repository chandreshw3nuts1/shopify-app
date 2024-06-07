import { useState } from "react";
import { json } from "@remix-run/node";


export const loader = async ({ request }) => {
  console.log("============================== route ================");
  return json({
    "install" : "loader"
  });
};

export const action = async ({ request }) => {
  console.log("============================== route action================");

  return json({
    "install" : "ins"
  });
};
