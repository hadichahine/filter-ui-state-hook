import { act, renderHook } from "@testing-library/react-hooks";
import { useFilter } from "../../main";

test("test that clearing works on filter", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "first",
          label: "First",
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
    result.current.filter("first").toggle("a");
  });

  act(() => {
    result.current.filter("first").clear();
  });

  expect(result.current.filter("first").chosen.length).toBe(0);
});

test("test that clearing works on a certain filter doesn't affect another one", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "first",
          label: "First",
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
        {
          id: "second",
          label: "Second",
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
    result.current.filter("first").toggle("a");
  });

  act(() => {
    result.current.filter("second").toggle("a");
  });

  act(() => {
    result.current.filter("first").clear();
  });

  expect(result.current.filter("first").chosen.length).toBe(0);
  expect(result.current.filter("second").chosen[0].id).toBe("a");
});
