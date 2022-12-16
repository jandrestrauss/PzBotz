﻿using System;
using System.Collections.Generic;
using System.Timers;

public class ScheduleItem
{
    public string               Name            { get; }
    public string               DisplayName     { get; }
    public Action<List<object>> Function        { get; }
    public List<object>         Args            { get; set; }
    public ulong                IntervalMS      { get; set; }
    public DateTime             NextExecuteTime { get; set; }

    public ScheduleItem(string name, string displayName, ulong intervalMS, Action<List<object>> func, List<object> args)
    {
        Name           = name;
        DisplayName    = displayName;
        Function       = func;
        Args           = args;

        UpdateInterval(intervalMS);
    }

    public void UpdateInterval(ulong intervalMS=0)
    {
        if(intervalMS > 0) IntervalMS = intervalMS;
        NextExecuteTime = DateTime.Now.AddMilliseconds(IntervalMS);
    }
}

public static class Scheduler
{
    private static Timer clock;
    private static readonly List<ScheduleItem> scheduleItems = new List<ScheduleItem>();

    public static void Start(ulong intervalMS)
    {
        clock = new Timer
        {
            Interval = intervalMS
        };
        clock.Elapsed += new ElapsedEventHandler(ClockElapsed);
        clock.Start();
    }

    public static void Stop()
    {
        clock.Elapsed -= ClockElapsed;
        clock.Stop();
    }

    public static void AddItem(ScheduleItem item)
    {
        if(item.IntervalMS != 0)
            scheduleItems.Add(item);
    }

    public static void RemoveItem(string name)
    { 
        int index = scheduleItems.FindIndex(item => item.Name == name);
        if(index != -1) scheduleItems.RemoveAt(index);
    }

    public static ScheduleItem GetItem(string name)
    {
        return scheduleItems.Find(item => item.Name == name);
    }

    public static IReadOnlyCollection<ScheduleItem> GetItems()
    {
        return scheduleItems.AsReadOnly();
    }

    private static void ClockElapsed(object sender, ElapsedEventArgs e)
    {
        DateTime now = DateTime.Now;

        foreach(ScheduleItem item in scheduleItems)
        {
            if(item.IntervalMS != 0
            && now >= item.NextExecuteTime)
            {
                try { item.Function(item.Args); }
                catch(Exception ex) 
                { 
                    string exceptionMessage = $"Exception occured in ScheduleItem callback function. ScheduleItem: {item.Name}";

                    if(ex is AggregateException aggregateEx)
                    {
                        int i=0;
                        foreach(Exception innerEx in aggregateEx.InnerExceptions)
                            Logger.LogException(innerEx, $"{exceptionMessage}\n(THIS IS AN INNER EXCEPTION, NUMBER {++i})");
                    }
                    else Logger.LogException(ex, exceptionMessage);
                }
                    
                item.UpdateInterval();
            }
        }
    }

    public static void Dispose()
    {
        if(clock != null)
            clock.Dispose();
    }
}
