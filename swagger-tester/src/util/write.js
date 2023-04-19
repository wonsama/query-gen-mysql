import { write } from "./file.js";

function getTagName(json, name) {
  let tag = json.tags.filter((tag) => tag.name == name);
  return tag.length > 0 ? tag[0].description : "";
}

function nvl(source) {
  return source ? source : "";
}

/**
 * 입력받은 json 에서 get api 를 기록한다
 * @param {JSON} json
 */
export function writeApiGet(json) {
  let results = [];

  results.push(["태그", "태그명", "API 호출주소", "API 설명", "필수 파라미터", "선택 파라미터"].join(","));
  for (let [k1, v1] of Object.entries(json.paths)) {
    for (let [k2, v2] of Object.entries(v1)) {
      if (k2 == "get" && !v2.deprecated) {
        let reqired = v2.parameters
          ?.filter((x) => x.required)
          .map((x, i) => `${i + 1} : ${x.name}(${x.description.replace(/\n|\r/gi, "-").replace(/\,/gi, ".")})`)
          .join(" ");
        let notreqired = v2.parameters
          ?.filter((x) => !x.required)
          .map((x, i) => `${i + 1} : ${x.name}(${x.description.replace(/\n|\r/gi, "-").replace(/\,/gi, ".")})`)
          .join(" ");
        let row = [v2.tags[0], getTagName(json, v2.tags[0]), k1, v2.summary, nvl(reqired), nvl(notreqired)];
        results.push(row.join(","));
      }
    }
  }
  write("./output/info/api-get.csv", results.join("\n"));
}

/**
 * 입력받은 json 에서 전체 api 를 기록한다
 * @param {JSON} json
 */
export function writeApiAll(json) {
  let results = [];

  results.push(["태그", "메소드", "태그명", "API 호출주소", "API 설명", "필수 파라미터", "선택 파라미터"].join(","));
  for (let [k1, v1] of Object.entries(json.paths)) {
    for (let [k2, v2] of Object.entries(v1)) {
      if (!v2.deprecated) {
        let reqired = v2.parameters
          ?.filter((x) => x.required)
          .map((x, i) => `${i + 1} : ${x.name}(${x.description?.replace(/\n|\r/gi, "-").replace(/\,/gi, ".")})`)
          .join(" ");
        let notreqired = v2.parameters
          ?.filter((x) => !x.required)
          .map((x, i) => `${i + 1} : ${x.name}(${x.description?.replace(/\n|\r/gi, "-").replace(/\,/gi, ".")})`)
          .join(" ");
        let row = [v2.tags[0], k2, getTagName(json, v2.tags[0]), k1, v2.summary, nvl(reqired), nvl(notreqired)];
        results.push(row.join(","));
      }
    }
  }
  write("./output/info/api-all.csv", results.join("\n"));
}
