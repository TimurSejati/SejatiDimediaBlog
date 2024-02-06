export const categoryToOption = (category) => ({
  value: category._id,
  label: category.title,
});

export const filterCategories = (inputValue, categoriesData) => {
  const filteredOptions = categoriesData
    .map(categoryToOption)
    .filter((category) =>
      category.label.toLowerCase().includes(inputValue.toLowerCase())
    );

  return filteredOptions;
};

export const tagToOption = (tag) => ({
  value: tag._id,
  label: tag.title,
});

export const filterTags = (inputValue, categoriesData) => {
  const filteredOptions = categoriesData
    .map(tagToOption)
    .filter((tag) =>
      tag.label.toLowerCase().includes(inputValue.toLowerCase())
    );

  return filteredOptions;
};
