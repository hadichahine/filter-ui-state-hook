import { act, renderHook } from "@testing-library/react-hooks";
import { useFilter } from "../../index";

test("test filter to be unchosen initially", () => {
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

test("test filter option to be chosen after choosing option", () => {
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

test("test multiselect filter to toggle multiple options", () => {
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

test("test filter to be disabled when choosen again", () => {
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
    result.current.filters[0].options[0].choose();
  });

  expect(result.current.filters[0].options[0].chosen).toBe(false);
});

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
