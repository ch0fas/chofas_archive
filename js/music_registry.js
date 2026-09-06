let albumData = [];

// Loading CSV
fetch("../assets/data/albums.csv")
.then((response) => response.text())
.then((csvText) =>
{
    const results = Papa.parse(csvText, { header: true});
    albumData = results.data.map((row) =>
    {
        if (row.Listening_Date)
        {
            row.listenDate = new Date(row.Listening_Date);
        } else
        {
            row.listenDate = null;
        }
        return row;
    });
    applyFilters();
});

const inputs = ["album_name_filter", "artist_name_filter", "album_number_filter", "year_release_filter", "listening_day_filter", "listening_month_filter", "listening_year_filter", "listening_weekday_filter"];

inputs.forEach((id) =>
{
    document.getElementById(id).addEventListener("input", applyFilters);
});

// Filters
function applyFilters()
{
    const user_album = document.getElementById("album_name_filter").value.trim();
    const user_artist = document.getElementById("artist_name_filter").value.trim();
    const user_num = parseInt(document.getElementById("album_number_filter").value);
    const user_year_release = parseInt(document.getElementById("year_release_filter").value);
    const user_day = parseInt(document.getElementById("listening_day_filter").value);
    const user_month = parseInt(document.getElementById("listening_month_filter").value);
    const user_year = parseInt(document.getElementById("listening_year_filter").value);
    const user_weekday = parseInt(document.getElementById("listening_weekday_filter").value);

    const filtered = albumData.filter((row) =>
    {
        const date = row.listenDate;
        return (
            (!user_album || row.Album_Name.toLowerCase().includes(user_album.toLowerCase()))
            && (!user_artist || row.Artist_Group.toLowerCase().includes(user_artist.toLowerCase()))
            && (isNaN(user_num) || parseInt(row.Album_Number) == user_num)
            && (isNaN(user_year_release) || parseInt(row.Year_Of_Release) == user_year_release)
            && (isNaN(user_day) || (date && date.getDate() == user_day))
            && (isNaN(user_month) || (date && date.getMonth() + 1 == user_month))
            && (isNaN(user_year) || (date && date.getFullYear() == user_year))
            && (isNaN(user_weekday) || (date && date.getDay() == user_weekday))
        );
    });

    displayResults(filtered);
}

// To Display the full results
function displayResults(data)
{
    const tbody = document.querySelector("#album_table tbody");
    tbody.innerHTML = "";
    
    data.forEach((row) =>
    {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.Album_Number}</td>
            <td>${row.Album_Name}</td>
            <td>${row.Artist_Group}</td>
            <td>${row.listenDate ? row.listenDate.toLocaleDateString("en-us", { weekday: "short", day: "numeric", month: "short", year: "numeric"}): ""}</td>
            <td>${row.Year_Of_Release}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("amnt").textContent = `Albums: ${data.length} / ${albumData.length}`;
}