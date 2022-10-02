﻿using System;
using System.IO;

public static class Logger
{
    public const string LogFile = ".\\pzbot.log";

    public static void WriteLog(string text)
    {
        var file = File.AppendText(LogFile);
        file.WriteLine(text);
        file.Close();
    }

    public static void LogException(Exception ex, string additional_msg="")
    {
        string ex_msg = "\n---------------\n" +
                        "Exception: "+ex.GetType().FullName +
                        "\nMessage: "+ex.Message +
                        "\nStack trace: "+ex.StackTrace.Trim() +
                        "\nDate: "+DateTime.UtcNow.ToString("dd/MM/yyyy, HH:mm:ss") +
                        (additional_msg != "" ? "\n"+additional_msg : "") +
                        "\n---------------\n";
        File.AppendAllText(LogFile, ex_msg);
    }
}
