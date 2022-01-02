import { renderHook } from "@testing-library/react-hooks";
import useFilter from "../useFilter";

test("test nothing", () => {
  const { result } = renderHook(useFilter);
  expect(result.current.count).toBe(0);
});
