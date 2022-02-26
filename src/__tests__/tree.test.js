import { act, renderHook } from "@testing-library/react-hooks";
import { useFilter } from "../../main";

test("test tree filter with one level.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "tree",
          options: [
            {
              id: "a",
              label: "A",
              children: [],
            },
            {
              id: "b",
              label: "B",
              children: [],
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

test("test tree filter with two levels.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "tree",
          options: [
            {
              id: "a",
              label: "A",
              children: [
                {
                  id: "aa",
                  label: "AA",
                },
                {
                  id: "ab",
                  label: "AB",
                },
              ],
            },
            {
              id: "b",
              label: "B",
              children: [
                {
                  id: "ba",
                  label: "BA",
                },
              ],
            },
          ],
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].options[0].children[0].choose();
  });

  expect(result.current.filters[0].options[0].children[0].chosen).toBe(true);
  expect(result.current.filters[0].options[0].children[1].chosen).toBe(false);
});

test("test tree filter when second level child is chosen parent isn't chosen.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "tree",
          options: [
            {
              id: "a",
              label: "A",
              children: [
                {
                  id: "aa",
                  label: "AA",
                  children: [
                    {
                      id: "aaa",
                      label: "AAA",
                    },
                  ],
                },
                {
                  id: "ab",
                  label: "AB",
                },
              ],
            },
            {
              id: "b",
              label: "B",
              children: [
                {
                  id: "ba",
                  label: "BA",
                },
              ],
            },
          ],
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].options[0].children[0].choose();
  });

  expect(result.current.filters[0].options[0].chosen).toBe(false);
});

test("test tree filter when third level child is chosen parent isn't chosen.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "tree",
          options: [
            {
              id: "a",
              label: "A",
              children: [
                {
                  id: "aa",
                  label: "AA",
                  children: [
                    {
                      id: "aaa",
                      label: "AAA",
                    },
                  ],
                },
                {
                  id: "ab",
                  label: "AB",
                },
              ],
            },
            {
              id: "b",
              label: "B",
              children: [
                {
                  id: "ba",
                  label: "BA",
                },
              ],
            },
          ],
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].options[0].children[0].children[0].choose();
  });

  expect(result.current.filters[0].options[0].children[0].chosen).toBe(false);
});

test("test tree filter with three levels.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "tree",
          options: [
            {
              id: "a",
              label: "A",
              children: [
                {
                  id: "aa",
                  label: "AA",
                  children: [
                    {
                      id: "aaa",
                      label: "AAA",
                    },
                  ],
                },
                {
                  id: "ab",
                  label: "AB",
                },
              ],
            },
            {
              id: "b",
              label: "B",
              children: [
                {
                  id: "ba",
                  label: "BA",
                },
              ],
            },
          ],
        },
      ],
    })
  );

  act(() => {
    result.current.filters[0].options[0].children[0].children[0].choose();
  });

  expect(
    result.current.filters[0].options[0].children[0].children[0].chosen
  ).toBe(true);
  expect(result.current.filters[0].options[0].children[0].children[0].id).toBe(
    "aaa"
  );
});

test("test tree filter toggle first level.", () => {
  const { result } = renderHook(() =>
    useFilter({
      filters: [
        {
          id: "category",
          label: "Category",
          type: "tree",
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
