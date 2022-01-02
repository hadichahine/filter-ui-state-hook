import { act, renderHook } from "@testing-library/react-hooks";
import { useFilter } from "../../index";

test("test category filter to be unchosen initially", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "singleselect",
          options: [
            {
              id: "a",
              label: "A",
            },
            {
              id: "b",
              label: "B",
            },
          ],
        },
      ],
    })
  );

  expect(result.current.filters[0].options[0].chosen).toBe(false);
});

test("test category filter to be chosen after choosing it", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "singleselect",
          options: [
            {
              id: "a",
              label: "A",
            },
            {
              id: "b",
              label: "B",
            },
          ],
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].options[0].choose();
  });

  expect(result.current.filters[0].options[0].chosen).toBe(true);
});

test("test category filter to be multiselect.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "multiselect",
          options: [
            {
              id: "a",
              label: "A",
            },
            {
              id: "b",
              label: "B",
            },
          ],
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].options[0].choose();
  });

  act(() => {
    result.current.filters[0].options[1].choose();
  });

  expect(result.current.filters[0].options[0].chosen).toBe(true);
  expect(result.current.filters[0].options[1].chosen).toBe(true);
});
