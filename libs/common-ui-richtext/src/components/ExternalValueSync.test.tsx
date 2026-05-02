import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useExternalValueSyncBarrier } from "./ExternalValueSync";

type TestValue = {
  id: string;
};

describe("useExternalValueSyncBarrier", () => {
  it("does not increment the revision when the value sent by onChange comes back from props", () => {
    const onChange = vi.fn();
    const initialValue = { id: "initial" };
    const changedValue = { id: "changed" };
    const { result, rerender } = renderHook(
      ({ value }) => useExternalValueSyncBarrier(value, onChange, Object.is),
      { initialProps: { value: initialValue } },
    );

    expect(result.current.lastKnownValue).toBe(initialValue);
    expect(result.current.revision).toBe(0);

    act(() => {
      result.current.handleChange(changedValue);
    });

    expect(onChange).toHaveBeenCalledWith(changedValue);
    expect(result.current.revision).toBe(0);

    rerender({ value: changedValue });

    expect(result.current.lastKnownValue).toBe(changedValue);
    expect(result.current.revision).toBe(0);
  });

  it("increments the revision when props receive a different external value", () => {
    const onChange = vi.fn();
    const initialValue = { id: "initial" };
    const externalValue = { id: "external" };
    const { result, rerender } = renderHook(
      ({ value }) => useExternalValueSyncBarrier(value, onChange, Object.is),
      { initialProps: { value: initialValue } },
    );

    rerender({ value: externalValue });

    expect(result.current.lastKnownValue).toBe(externalValue);
    expect(result.current.revision).toBe(1);
  });

  it("uses the provided equality function to detect equivalent external values", () => {
    const onChange = vi.fn();
    const initialValue = { id: "same" };
    const equivalentValue = { id: "same" };
    const equalityFn = (previous: TestValue, next: TestValue) => previous.id === next.id;
    const { result, rerender } = renderHook(
      ({ value }) => useExternalValueSyncBarrier(value, onChange, equalityFn),
      { initialProps: { value: initialValue } },
    );

    rerender({ value: equivalentValue });

    expect(result.current.lastKnownValue).toBe(initialValue);
    expect(result.current.revision).toBe(0);
  });
});
