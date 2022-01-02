import { act, renderHook } from "@testing-library/react-hooks";
import { useFilter } from "../../index";

test("test filter reducer being executed after every modification.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "categoryA",
          label: "Category A",
          type: "singleselect",
          options: [
            {
              id: "a",
              label: "A",
            },
          ],
        },
      ],
      reducer(currentFilters, state) {
        const { categoryA } = state;
        if (categoryA)
          return [
            {
              id: "categoryB",
              label: "Category B",
              type: "singleselect",
              options: [
                {
                  id: "a",
                  label: "A",
                },
              ],
            },
          ];
        else return currentFilters;
      },
    })
  );

  expect(result.current.filters[0].id).toBe("categoryA");

  act(() => {
    result.current.filters[0].options[0].choose();
  });

  expect(result.current.filters[0].id).toBe("categoryB");
});
