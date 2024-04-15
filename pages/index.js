import { useState } from "react";
import axios from "axios";
import { FaSortAlphaDown, FaSortAlphaDownAlt } from "react-icons/fa";
function SearchInput({ searchTerm, onSearchChange }) {
  return (
    <input
      type="text"
      placeholder="Search your game"
      className="form-control my-3 search-input"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}
function SortButton({ sortOrder, onSortClick }) {
  return (
    <button
      onClick={onSortClick}
      className="btn btn-outline-warning  mx-5 my-3"
    >
      {sortOrder === "asc" ? <FaSortAlphaDownAlt /> : <FaSortAlphaDown />}
    </button>
  );
}
function GamesTable({ filteredGames }) {
  return (
    <table className="table table-bordered table-hover games-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Platform</th>
          <th>Score</th>
          <th>Genre</th>
          <th>Editor's Choice</th>
        </tr>
      </thead>
      <tbody>
        {filteredGames.map((game, index) => (
          <tr key={index}>
            <td>{game.title}</td>
            <td>{game.platform}</td>
            <td>{game.score}</td>
            <td>{game.genre}</td>
            <td>{game.editors_choice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function GamesList({ games }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };
  const sortedGames = [...games].sort((a, b) => {
    const platformA = a.platform ? a.platform.toLowerCase() : "";
    const platformB = b.platform ? b.platform.toLowerCase() : "";
    if (sortOrder === "asc") {
      if (platformA < platformB) {
        return -1;
      } else if (platformA > platformB) {
        return 1;
      }
      return 0;
    } else {
      if (platformA > platformB) {
        return -1;
      } else if (platformA < platformB) {
        return 1;
      }
      return 0;
    }
  });
  const filteredGames = sortedGames.filter((game) =>
    game.title
      ? game.title.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );
  return (
    <div className="container custom-table">
      <div className="games-list-container">
        <div className="header">
          <div
            className="button"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <SearchInput
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <SortButton sortOrder={sortOrder} onSortClick={handleSortClick} />
          </div>
          <GamesTable filteredGames={filteredGames} />
        </div>
      </div>
    </div>
  );
}
export default GamesList;
export async function getServerSideProps() {
  try {
    const response = await axios.get(
      "https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json"
    );
    const data = response.data;
    return {
      props: {
        games: data,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}
