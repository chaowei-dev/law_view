export const processJfull = (cases, searchKeyword) => {
  // Parse jfullKeyword from searchKeyword
  const params = new URLSearchParams(searchKeyword);
  const jfullKeyword = params.get("jfull") || "";

  return cases.map((caseItem) => {
    // Check if the search keyword is in the jfull
    // If yes, add the summary of the jfull
    // If no, set the summary to empty string
    if (jfullKeyword && caseItem.jfull.includes(jfullKeyword)) {
      // Remove the \r, \n, space for the jfull
      caseItem.jfull = caseItem.jfull
        .replace(/\r\n/g, " ")
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/\s+/g, " ");

      // Index of the keyword in the full text
      const keywordIndex = caseItem.jfull.indexOf(jfullKeyword);
      const start = Math.max(0, keywordIndex - 65);
      const end = Math.min(
        caseItem.jfull.length,
        keywordIndex + jfullKeyword.length + 65
      );

      // Summary of the full text
      caseItem.jfullSummary = caseItem.jfull.substring(start, end);

      // Add ... to the start and end of the summary
      if (start > 0) caseItem.jfullSummary = "... " + caseItem.jfullSummary;

      if (end < caseItem.jfull.length)
        caseItem.jfullSummary = caseItem.jfullSummary + " ...";

      // Highlight the keyword in the summary
      caseItem.jfullSummary = caseItem.jfullSummary.replace(
        jfullKeyword,
        `<mark>${jfullKeyword}</mark>`
      );
    } else {
      caseItem.jfullSummary = "";
    }

    // Remove the full text for the response
    delete caseItem.jfull;

    return caseItem;
  });
};

export const buildDynamicKeywordClause = (searchKeyword) => {
  // Parse searchKeyword and extract individual keywords
  const params = new URLSearchParams(searchKeyword);
  const jidKeyword = params.get("jid") || "";
  const remarksKeyword = params.get("remarks") || "";
  const jfullKeyword = params.get("jfull") || "";
  const isHide = params.get("isHide") || "";
  const desc = params.get("desc") || "";

  // Log
  console.log(
    `jidKeyword:${jidKeyword}, remarksKeyword:${remarksKeyword}, jfullKeyword:${jfullKeyword}, isHide:${isHide}`
  );

  // Build the where clause based on the keyword
  let whereClause = {};

  if (jidKeyword || remarksKeyword || jfullKeyword) {
    whereClause.AND = [];

    // "jid" keyword
    if (jidKeyword) whereClause.AND.push({ jid: { contains: jidKeyword } });

    // "remarks" keyword
    // Check remarks is not empty
    // 1. return cases with keyword
    // 2. return cases with non-empty remarks (any character)
    if (remarksKeyword === "!null") {
      whereClause.AND.push({ remarks: { not: "" } });
    } else if (remarksKeyword) {
      whereClause.AND.push({ remarks: { contains: remarksKeyword } });
    }

    // "jfull" keyword
    if (jfullKeyword)
      whereClause.AND.push({ jfull: { contains: jfullKeyword } });

    // "isHide" keyword (boolean)
    if (isHide === "true") whereClause.AND.push({ is_hide: true });
    if (isHide === "false") whereClause.AND.push({ is_hide: false });
  }

  return whereClause;
};

export const buildDynamicOrderBy = (searchKeyword) => {
  const params = new URLSearchParams(searchKeyword);

  let desc = params.get('desc') || '';
  
  console.log(`desc: ${desc}`);
  
  let orderByClause = {};

  if (desc === 'true') {
    orderByClause = { updatedAt: 'desc' };
  }

  if (desc === 'false') {
    orderByClause = { updatedAt: 'asc' };
  }

  return orderByClause;
}