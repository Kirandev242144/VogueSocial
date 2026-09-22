async function test() {
  const url = 'http://localhost:3000/api/store/tom';
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}
test();
