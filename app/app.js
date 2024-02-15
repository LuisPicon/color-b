import { All, frontEnd, backEnd, databases } from "../db/db.js";

const d = document,
  $search = d.getElementById("search"),
  $resultScroll = d.getElementById("result"),
  $result = d.getElementById("result-grid"),
  $cleanSearch = d.querySelector(".clean-search"),
  $containerCopied = d.getElementById("container-successful-copied");
//objects
class UX {
  UpdateNav(event) {
    event.parentElement.querySelector(".active").classList.remove("active");
    event.classList.add("active");
    $search.value = "";
    $cleanSearch.classList.remove("clean-search-active");
  }
}
class InterfaceRequest {
  constructor() {
    this.context;
    this.interval;
    this.$template;
    this.max = 60;
    this.min = 30;

    this.range = 0;
  }
  searchRange() {
    for (let i in this.context) {
      this.range++;
    }
  }
  updateContext(context) {
    $result.scrollTop = 0;
    this.context = context;
    this.$template = "";
    this.range = 0;
    this.max = 60;
    this.min = 30;
  }
  insertData() {
    this.$template = "  ";
    this.searchRange();
    console.log(this.range);
    let counter = 1,
      j = 0;
    for (let i in this.context) {
      this.$template += `
        <div class="card-color" style="animation-delay:${j}ms;">
          <p class="lenguaje" style="background-color:${this.context[i][0]}">${i}</p>
          <div class="card-color-copy">
          <img class="btn-copy" src="https://img.icons8.com/material-rounded/24/FFFFFF/copy.png" alt="copy"/>
            <select class="select-color" name="select-color">
              <option value="${this.context[i][0]}">HEX</option>
              <option value=" ${this.context[i][1]}">RGB</option>
            </select>
          </div>
        </div>
        `;
      if (counter < 30) {
        counter++;
      } else {
        break;
      }
      j += 30;
    }
    $result.innerHTML = this.$template;
  }
  searchData(event) {
    this.$template = "";
    $cleanSearch.classList.add("clean-search-active");
    if (event.target.value === "") {
      $cleanSearch.classList.remove("clean-search-active");
      this.updateContext(this.context);

      return this.insertData();
    }
    event = event.target.value.toLocaleLowerCase();
    let j = 0;
    for (let i in this.context) {
      if (i.toLocaleLowerCase().includes(event)) {
        this.$template += `
          <div class="card-color" style="animation-delay:${j}ms;">
            <p  class="lenguaje" style="background-color:${this.context[i][0]}">${i}</p>
            <div class="card-color-copy">
              <img class="btn-copy"  src="https://img.icons8.com/material-rounded/24/FFFFFF/copy.png" alt="copy" />
              <select class="select-color" name="select-color">
                <option value="${this.context[i][0]}">HEX</option>
                <option value=" ${this.context[i][1]}">RGB</option>
              </select>
            </div>
          </div>
        `;
        j += 30;
      }
    }
    if (this.$template.length > 0) {
      $result.innerHTML = this.$template;
    } else {
      console.log($result);
      $result.innerHTML = `
      <div class="not-fund">
       <p ><span>🙀</span>Languages not found.</p>
      </div>`;
    }
  }
  copyColor(event) {
    let colorCode = event.parentElement.querySelector("select").value;
    if (this.interval) clearInterval(this.interval);
    navigator.clipboard
      .writeText(colorCode)
      .then(() => {
        $containerCopied.innerHTML = ` 
          <div class="successful-copied">
          <img  src="https://img.icons8.com/ios-glyphs/30/ok--v1.png" alt="ok--v1"/>
            <p>Color copied</p>
          </div>`;
        this.interval = setTimeout(() => {
          $containerCopied.innerHTML = "";
        }, 2500);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  loadMoreLanguages() {
    let $template = "",
      i = 0,
      j = 0;
    for (let l in this.context) {
      if (j > this.min && j < this.max) {
        $template += `
        <div class="card-color" style="animation-delay:${i}ms;">
          <p class="lenguaje" style="background-color:${this.context[l][0]}">${l}</p>
          <div class="card-color-copy">
          <img class="btn-copy" src="https://img.icons8.com/material-rounded/24/FFFFFF/copy.png" alt="copy"/>
            <select class="select-color" name="select-color">
              <option value="${this.context[l][0]}">HEX</option>
              <option value=" ${this.context[l][1]}">RGB</option>
            </select>
          </div>
        </div>
        `;
        i += 30;
      }
      j++;
    }
    $result.insertAdjacentHTML("beforeend", $template);
    this.min *= 2;
    this.max *= 2;
  }
}
//instances
const ux = new UX();
const interfaceRequest = new InterfaceRequest();
//
d.addEventListener("DOMContentLoaded", (e) => {
  interfaceRequest.updateContext(All);
  interfaceRequest.insertData();
});
//
$search.addEventListener("keyup", (e) => {
  interfaceRequest.searchData(e);
});
//
d.addEventListener("click", (e) => {
  if (e.target.matches("#all")) {
    ux.UpdateNav(e.target);
    interfaceRequest.updateContext(All);
    interfaceRequest.insertData();
  }
  if (e.target.matches("#front-end")) {
    ux.UpdateNav(e.target);
    interfaceRequest.updateContext(frontEnd);
    interfaceRequest.insertData();
  }
  if (e.target.matches("#back-end")) {
    ux.UpdateNav(e.target);
    interfaceRequest.updateContext(backEnd);
    interfaceRequest.insertData();
  }
  if (e.target.matches("#databases")) {
    ux.UpdateNav(e.target);
    interfaceRequest.updateContext(databases);
    interfaceRequest.insertData();
  }
  if (e.target.matches(".clean-search")) {
    $cleanSearch.classList.remove("clean-search-active");
    $search.value = "";
    interfaceRequest.insertData();
  }
  if (e.target.matches(".btn-copy")) {
    interfaceRequest.copyColor(e.target);
  }
});

$result.addEventListener("scroll", () => {
  let contentHeight = $result.scrollHeight,
    scrollPosition = $result.scrollTop + $result.clientHeight;
  console.log(contentHeight, scrollPosition);
  if (
    scrollPosition >= contentHeight &&
    !$result.querySelector(".not-fund") &&
    !$cleanSearch.classList[1]
  ) {
    interfaceRequest.loadMoreLanguages();
  }
});
