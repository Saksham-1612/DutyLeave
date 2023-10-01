export default (req, res) => {
  if (req.method === "GET") {
    // Handle GET request
    const data = {
      message: "This is a GET request",
    };
    res.status(200).json(data);
  } else if (req.method === "POST") {
    // Handle POST request
    const data = {
      message: "This is a POST request",
    };
    res.status(200).json(data);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
