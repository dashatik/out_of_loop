/// <reference types="react-scripts" />
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

declare module "@react-three/fiber" {
  interface ThreeElements {
    textGeometry: ReactThreeFiber.Node<TextGeometry, typeof TextGeometry>;
  }
}
