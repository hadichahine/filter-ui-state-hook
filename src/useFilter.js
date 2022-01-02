import { useState } from "react";

export default function useFilter(options) {
  const { filters } = options;

  const [chosenFilters, setChosenFilters] = useState({});

  function createRangeFilter(filterManifest) {
    const { id: filterId, options = [], ...remaining } = filterManifest;

    return {
      id: filterId,
      ...remaining,
      set({ start, end }) {
        setChosenFilters({
          ...chosenFilters,
          [filterId]: {
            start,
            end,
          },
        });
      },
      range: chosenFilters[filterId] ?? {},
      options: options.map(({ start, end }) => ({
        start,
        end,
        choose() {
          setChosenFilters({
            ...chosenFilters,
            [filterId]: {
              start,
              end,
            },
          });
        },
        chosen:
          chosenFilters[filterId]?.start === start &&
          chosenFilters[filterId]?.end === end,
      })),
    };
  }

  function createMultiSelectFilter(filterManifest) {
    const { id: filterId, options = [], ...remaining } = filterManifest;

    return {
      ...remaining,
      id: filterId,
      options: options.map(({ id: optionId, ...remaining }) => ({
        ...remaining,
        id: optionId,
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
      })),
    };
  }

  function createSingleSelectFilter(filterManifest) {
    const { id: filterId, options = [], ...remaining } = filterManifest;

    return {
      ...remaining,
      id: filterId,
      ...(options && {
        options: options.map(({ id: optionId, ...remaining }) => ({
          ...remaining,
          id: optionId,
          choose() {
            setChosenFilters({
              ...chosenFilters,
              [filterId]: optionId,
            });
          },
          chosen: chosenFilters[filterId] === optionId,
        })),
      }),
    };
  }

  function filter(filterManifest) {
    const { type } = filterManifest;
    if (type === "range") return createRangeFilter(filterManifest);
    if (type === "multiselect") return createMultiSelectFilter(filterManifest);
    if (type === "singleselect")
      return createSingleSelectFilter(filterManifest);
    return null;
  }

  return {
    filters: filters.map(filter),
  };
}
