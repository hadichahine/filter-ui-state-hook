import _ from "lodash";
import { useState } from "react";

export default function useFilter(options) {
  const { filters, reducer = (filters) => filters, initial = {} } = options;

  const [chosenFilters, setChosenFilters] = useState(initial);

  function createTreeFilter(filterManifest) {
    const { id: filterId, options = [], ...remaining } = filterManifest;

    function treeOption({
      id: optionId,
      children = [],
      parentPath = [],
      ...remaining
    }) {
      return {
        ...remaining,
        id: optionId,
        choose() {
          choose([...parentPath, optionId]);
        },
        chosen: isChosen([...parentPath, optionId]),
        children: children.map((childTreeOption) =>
          treeOption({ ...childTreeOption, parentPath: [optionId] })
        ),
      };
    }

    function choose(path) {
      let chosenFiltersSectionClone = { ...chosenFilters[filterId] };
      if (!isChosen(path))
        _.setWith(chosenFiltersSectionClone, path, {}, Object);
      else
        chosenFiltersSectionClone = _.omit(chosenFiltersSectionClone, [path]);
      setChosenFilters({
        ...chosenFilters,
        [filterId]: chosenFiltersSectionClone,
      });
    }

    function isChosen(path) {
      return (
        _.has(chosenFilters[filterId], path) &&
        Object.entries(_.get(chosenFilters[filterId], path)).length === 0
      );
    }

    return {
      ...remaining,
      id: filterId,
      options: options.map(treeOption),
    };
  }

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

    const enrichedOptions = options.map(({ id: optionId, ...remaining }) => ({
      ...remaining,
      id: optionId,
      choose() {
        if ((chosenFilters[filterId] ?? []).includes(optionId))
          setChosenFilters({
            ...chosenFilters,
            [filterId]: chosenFilters[filterId].filter((id) => id !== optionId),
          });
        else
          setChosenFilters({
            ...chosenFilters,
            [filterId]: [...(chosenFilters[filterId] ?? []), optionId],
          });
      },
      chosen: (chosenFilters[filterId] ?? []).includes(optionId),
    }));

    return {
      ...remaining,
      id: filterId,
      chosen: (chosenFilters[filterId] ?? []).map((optionId) =>
        filterManifest.options.find(({ id }) => id === optionId)
      ),
      toggle(givenId) {
        if (enrichedOptions.find(({ id }) => givenId === id))
          enrichedOptions.find(({ id }) => givenId === id).choose();
      },
      options: enrichedOptions,
    };
  }

  function createSingleSelectFilter(filterManifest) {
    const { id: filterId, options = [], ...remaining } = filterManifest;

    return {
      ...remaining,
      id: filterId,
      chosen: filterManifest.options.find(
        ({ id }) => id === chosenFilters[filterId]
      ),
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
    };
  }

  function createFilterFromManifest(filterManifest) {
    const { type } = filterManifest;

    switch (type) {
      case "range":
        return createRangeFilter(filterManifest);
      case "multiselect":
        return createMultiSelectFilter(filterManifest);
      case "singleselect":
        return createSingleSelectFilter(filterManifest);
      case "tree":
        return createTreeFilter(filterManifest);
      default:
        return null;
    }
  }

  const filtersMapById = Object.fromEntries(
    reducer(filters, chosenFilters).map((filterManifest) => [
      filterManifest.id,
      {
        ...createFilterFromManifest(filterManifest),
        clear() {
          setChosenFilters(_(chosenFilters).omit(filterManifest.id).value());
        },
      },
    ])
  );

  return {
    filters: Object.values(filtersMapById),
    filter(id) {
      return filtersMapById[id];
    },
    chosenFilters,
  };
}
