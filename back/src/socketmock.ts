import { Server } from "socket.io";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import { io } from "./socket";

jest.mock("./socket", () => ({
    __esModule: true,
    io: mockDeep<Server>(),
}));

beforeEach(() => {
    mockReset(ioMock);
    ioMock.emit.mockClear();
});

export const ioMock = io as unknown as DeepMockProxy<Server>;