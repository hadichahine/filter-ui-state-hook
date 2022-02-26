import { act, renderHook } from "@testing-library/react-hooks";
import { useFilter } from "../../main";

test("test range filter to be initially empty.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "range",
        },
      ],
    })
  );

  expect(result.current.filters[0].range.start).toBe(undefined);
  expect(result.current.filters[0].range.end).toBe(undefined);
});

test("test range filter to select range", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "range",
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].set({ start: 100, end: 1000 });
  });

  expect(result.current.filters[0].range.start).toBe(100);
  expect(result.current.filters[0].range.end).toBe(1000);
});

test("test range filter to select range from options", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "range",
          options: [
            {
              start: 100,
              end: 1000,
            },
            {
              start: 200,
              end: 2000,
            },
          ],
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].options[0].choose();
  });

  expect(result.current.filters[0].range.start).toBe(100);
  expect(result.current.filters[0].range.end).toBe(1000);
});

test("test range filter to automatically active chosen for option when range set with 'set' is matching", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "range",
          options: [
            {
              start: 100,
              end: 1000,
            },
            {
              start: 200,
              end: 2000,
            },
          ],
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].set({ start: 100, end: 1000 });
  });

  expect(result.current.filters[0].options[0].chosen).toBe(true);
});
