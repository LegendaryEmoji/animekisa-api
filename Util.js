const fetch = require("node-fetch").default, cheerio = require("cheerio");

async function GetHTML(Link) {
  const res = await fetch(Link);
  const text = await res.text();
  return text;
};

async function Search(HTML) {
    const $ = await cheerio.load(HTML);
    const Subbed = [], Dubbed = [], Movies = [];
    $(".similarboxmain").each((id, sbm) => {
      $(sbm).find(".similarbox .an").each((i, a) => {
            const Title = $(a).find(".similardd").text().trim(),
                Categories = $(a).find(".similardd-categories").text().trim().split(", ");
            const Image = "https://animekisa.tv" + $(a).find(".coveri").attr("src"),
                Link = "https://animekisa.tv" + $(a).attr("href");
            const Obj = {
                Title,
                Categories: Categories || [],
                Image,
                Link
            };
            if (Image != "https://animekisa.tvundefined") {
              if (id == 0) Subbed.push(Obj);
              if (id == 1) Dubbed.push(Obj);
              if (id == 2) Movies.push(Obj);
            };
        });
    });
    return {
      Subbed,
      Dubbed,
      Movies
    };
};

async function GetInfo(HTML) {
  const $ = await cheerio.load(HTML);
  const Title = $("h1[class='infodes']").text(), Image = "https://animekisa.tv" + $("img[class='posteri']").attr("src");
  const Summary = $(".infodes2").first().text().startsWith("\nStatus:") ? null : $(".infodes2").first().text(), Alias = $(".infodes2 .textd:contains('Alias:')").next().text();
  const Categories = $(".textd:contains('Categories:')").next().text().trim().split(", "), Status = $(".textd:contains('Status:')").next().text(), EpisdoesCount = $(".textd:contains('Episodes:')").next().text();
  let Related = [], Episodes = [];

  $(await $(".textd:contains('Related Content:')").next()).find(".infoan").each((i, ani) => {
    Related.push({ Name: $(ani).text(), Link: $(ani).attr("href") });
  });
  $(".infoepbox a").each((i, ani) => {
    Episodes.push({ Index: $(ani).find(".infoept2 .centerv").text(), Link: "https://animekisa.tv/" + $(ani).attr("href") });
  });

  Episodes = Episodes.reverse();

  if (Image != "https://animekisa.tvundefined") return { Title, Image, Alias, Categories, Status, EpisdoesCount, Summary, Episodes, Related };
  return {};
};

async function Home(HTML) {
  const $ = await cheerio.load(HTML);
  const List = [];
  $(".listAnimes").children().each(async (i, ani) => {
    const Title = $(ani).find(".title-box-2").text().trim(), Image = $(ani).find(".image-box img").attr("src");
    const EpLink = "https://animekisa.tv" + $(ani).find("a[class='an']").first().attr("href"), AnimeLink = "https://animekisa.tv" + $(ani).find("a[class='an']").eq(2).attr("href");
    if (Title != "") List.push({ Title, Image, EpLink, AnimeLink });
  });
  return List;
};

async function Popular(HTML) {
  const $ = await cheerio.load(HTML);
  const List = [];
  $(".listAnimes").children().each(async (i, ani) => {
     const Title = $(ani).find(".similardd").text().split(". "), Image = $(ani).find(".similarpic img").attr("src");
     const Categories = $(ani).find(".similardd-categories").text().split(", ");
     if (Title) List.push({ Index: Title[0], Title: Title.slice(1).join(". "), Image, Categories });
  });
  return List;
};

async function Anime(HTML) {
  const $ = await cheerio.load(HTML);
  let List = [];
  $(".lisbox").has(".an").children().each(async (i, ani) => {
    const Title = $(ani).find(".lis").text(), Link = "https://animekisa.tv" + $(ani).attr("href");
    if (Title != "") List.push({ Title, Link });
  });
  return List;
};

module.exports.GetHTML = GetHTML;
module.exports.Search = Search;
module.exports.GetInfo = GetInfo;
module.exports.Home = Home;
module.exports.Popular = Popular;
module.exports.Anime = Anime;