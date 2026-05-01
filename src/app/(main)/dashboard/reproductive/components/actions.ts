"use server";

import { getSession } from "../../../../../lib/authentication";
import { getcuruser } from "../../../../api/user/api";
import { assignmentApi } from "../../../../api/user-assign/api";
import type { UserResponseDto } from "../../../../api/user-assign/types";

export type AssignedMidwifeResult =
  | {
      status: "SUCCESS";
      data: UserResponseDto;
    }
  | {
      status: "NO_MIDWIFE";
      message: string;
    }
  | {
      status: "FAIL";
      message: string;
    };

export async function getAssignedMidwifeAction(): Promise<AssignedMidwifeResult> {
  try {
    const session = await getSession();

    if (!session?.user?.token) {
      return {
        status: "FAIL",
        message: "You are not logged in.",
      };
    }

    const token = session.user.token;

    const currentUser = await getcuruser(token);

    if (!currentUser?.id) {
      return {
        status: "FAIL",
        message: "Could not identify the current user.",
      };
    }

    const midwife = await assignmentApi.getAssignedMidwifeForMother(
      currentUser.id,
      token
    );

    if (!midwife?.id) {
      return {
        status: "NO_MIDWIFE",
        message: "No midwife is currently assigned.",
      };
    }

    return {
      status: "SUCCESS",
      data: midwife,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load assigned midwife.";

    return {
      status: "FAIL",
      message,
    };
  }
}