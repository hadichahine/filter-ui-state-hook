import { useState } from "react";

export default function useFilter(options) {
  const { filters } = options;

  const [chosenFilters, setChosenFilters] = useState({});

  function filter({ id: filterId, options, type, ...remaining }) {
    return {
      ...remaining,
      id: filterId,
      type,
      options: options.map(({ id: optionId, ...remaining }) => ({
        ...remaining,
        id: optionId,
        ...(type === "singleselect"
          ? {
              choose() {
                setChosenFilters({
                  ...chosenFilters,
                  [filterId]: optionId,
                });
              },
              chosen: chosenFilters[filterId] === optionId,
            }
          : type === "multiselect"
          ? {
              choose() {
                if ((chosenFilters[filterId] ?? []).includes(optionId))
                  setChosenFilters({
                    ...chosenFilters,
                    [filterId]: chosenFilters[filterId].filter(
                      (id) => id !== optionId
                    ),
                  });
                else
                  setChosenFilters({
                    ...chosenFilters,
                    [filterId]: [...(chosenFilters[filterId] ?? []), optionId],
                  });
              },
              chosen: (chosenFilters[filterId] ?? []).includes(optionId),
            }
          : { chosen: false, choose() {} }),
      })),
    };
  }

  return {
    filters: filters.map(filter),
  };
}
