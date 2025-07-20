"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testController = void 0;
const db_config_1 = require("../config/db.config");
const getTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { data: test, error } = yield db_config_1.supabase.from("test").select("*");
        if (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(200).json({ data: test });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const createTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, error } = yield db_config_1.supabase
            .from("test")
            .insert([{ created_at: new Date().toISOString() }])
            .select();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json({ data: data });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.testController = {
    getTest,
    createTest,
};
