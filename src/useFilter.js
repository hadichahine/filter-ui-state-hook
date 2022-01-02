import { useState } from "react";

export default function useFilter(options) {
  const { filters } = options;

  const [chosenFilters, setChosenFilters] = useState({});

  function choose(filterId, optionId) {
    setChosenFilters({
      ...chosenFilters,
      [filterId]: optionId,
    });
  }

  function filter({ id: filterId, options, ...remaining }) {
    return {
      ...remaining,
      id: filterId,
      options: options.map(({ id: optionId, ...remaining }) => ({
        ...remaining,
        id: optionId,
        choose() {
          choose(filterId, optionId);
        },
        chosen: chosenFilters[filterId] === optionId,
      })),
    };
  }

  return {
    filters: filters.map(filter),
  };
}
