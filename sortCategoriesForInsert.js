// Code challenge submission for CSC Generation's sortCategoriesForInsert

// I populated the test case JSON data into a separate file; loading it here
const categories = require("./categoriesForInsert.json");

// Some notes:
//  Deliberately using .forEach as it's technically faster than `for (const element of array)`, but
//    more readable than `for (let i = 0; i < array.length; i++)` loops; for extremely large datasets
//    this could be refactored to use the latter to shave some operating time off

// Main sorting function:
// Time complexity O(n), space complexity O(n)
function sortCategoriesForInsert(jsonInput) {
  // If the format of the input is a JSON string, this would need:
  // jsonInput = JSON.parse(jsonInput);

  const validCategories = [],
    validParents = {},
    awaitingParents = {};

  jsonInput.forEach((category) => {
    const parent_id = category.parent_id; // Caching this for multiple references below

    // If the parent id is null or valid, this category is valid
    if (parent_id === null || parent_id in validParents) {
      addValidCategory(
        category,
        validCategories,
        validParents,
        awaitingParents
      );

      // Otherwise, this category is awaiting a valid parent id
    } else {
      awaitingParents[parent_id] = awaitingParents[parent_id] || [];
      awaitingParents[parent_id].push(category);
    }
  });

  // If the output is required to be a JSON string, this would need:
  //  JSON.stringify(validCategories);
  return validCategories;
}

// Helper function that adds a category to the array of valid categories, and:
//  registers the category as a valid parent, and:
//  recursively calls itself when it discovers an id registered in awaitingParents
function addValidCategory(
  category,
  validCategories,
  validParents,
  awaitingParents
) {
  validCategories.push(category);
  validParents[category.id] = true;

  if (category.id in awaitingParents) {
    awaitingParents[category.id].forEach((categoryAwaitingParent) => {
      addValidCategory(
        categoryAwaitingParent,
        validCategories,
        validParents,
        awaitingParents
      );
    });
  }
}

// Console.log for testing purposes
console.log(sortCategoriesForInsert(categories));

module.exports = sortCategoriesForInsert;
